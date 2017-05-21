import {Injectable} from '@angular/core';
import {
  GoogleRealtimeService,
} from '../../service/google-realtime.service';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import { Card } from '../../model/card';
import { Arrow } from '../../model/arrow';
import { Point } from '../../model/geometry';

// NOTE: These type aliases are not type-checked. They are just for readability.
// TODO(eyuelt): is there a way of getting these type-checked?
// A point in the coordinate system of the viewport.
export type ViewportCoord = Point;
// A point in the coordinate system of the canvas.
export type CanvasCoord = Point;

// Specifies the type of connection an arrow has to a card.
export enum ArrowConnectionType {
  INCOMING,
  OUTGOING
}

/*
 * The CanvasService maintains the data of the cards to show on the canvas,
 * handles zooming and panning on the canvas.
 * Zooming grows and shrinks the viewport relative to the canvas and panning
 * translates the viewport relative to the canvas.
 * This class also handles converting between the viewport's coordinate system,
 * the size of which is finite, and the canvas' coordinate system, which is
 * infinitely large.
 * The viewport coord system's origin is at the top left of the viewport.
 * The canvas coord system's origin starts off at the center of the viewport.
 */
@Injectable()
export class CanvasService {
  // The models of the cards to show on the canvas.
  cards: CollaborativeList<Card>;
  // The models of the arrows to show on the canvas.
  arrows: CollaborativeList<Arrow>;

  // The zoom scale relative to the original viewport size.
  zoomScale: number = 1;
  // The offset of the viewport from its original position.
  originOffset: CanvasCoord = {x: 0, y: 0};
  // If true, multipe
  multiSelectMode: boolean = false;
  // These are the keyboard keys that enable multi-select
  MULTI_SELECT_KEY_CODES: string[] = [
    'MetaLeft',  // Left cmd button on Mac
    'MetaRight'  // Right cmd button on Mac
  ];
  // TODO(eyuelt): I think I can use RXJS' Subject for this?
  // The list of functions to call when zoom or pan occurs. This is used to
  // essentially watch this class' properties.
  private listeners: {(): void}[] = [];
  // The min and max zoom scales.
  private kMinZoomScale: number = 0.1;
  private kMaxZoomScale: number = 10.0;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      if (currentDocument === null) {
        return;
      }

      let model = currentDocument.getModel();

      // Lazily instantiate the collaborative cards array.
      if (model.getRoot().get('cards') === null) {
        console.log('no "cards" object at root');
        let collaborativeCards = model.createList([]);
        model.getRoot().set('cards', collaborativeCards);
      }

      this.cards = model.getRoot().get('cards');

      // Lazily instantiate the collaborative arrows array.
      if (model.getRoot().get('arrows') === null) {
        console.log('no "arrows" object at root');
        let collaborativeArrows = model.createList([]);
        model.getRoot().set('arrows', collaborativeArrows);
      }

      this.arrows = model.getRoot().get('arrows');
    });
  }

  // Convert a point in the viewport coordinate space to a point in the canvas
  // coordinate space.
  viewportCoordToCanvasCoord(vp: ViewportCoord): CanvasCoord {
    const x = vp.x / this.zoomScale + this.originOffset.x;
    const y = vp.y / this.zoomScale + this.originOffset.y;
    return {x, y};
  }

  // Convert a point in the canvas coordinate space to a point in the viewport
  // coordinate space.
  canvasCoordToViewportCoord(cv: CanvasCoord): ViewportCoord {
    const x = (cv.x - this.originOffset.x) * this.zoomScale;
    const y = (cv.y - this.originOffset.y) * this.zoomScale;
    return {x, y};
  }

  // Zoom the canvas incrementally by incZoomScale, while keeping zoomPnt at
  // the same position relative to the viewport.
  zoom(zoomPoint: ViewportCoord, incrementalZoomScale: number) {
    const toZoom = this.zoomScale * incrementalZoomScale;
    if (toZoom > this.kMinZoomScale && toZoom < this.kMaxZoomScale) {
      this.originOffset.x +=
          zoomPoint.x * (1 - (1 / incrementalZoomScale)) / this.zoomScale;
      this.originOffset.y +=
          zoomPoint.y * (1 - (1 / incrementalZoomScale)) / this.zoomScale;
      this.zoomScale = toZoom;
      this.notifyListeners();
    }
  }

  // Pan the canvas by the vector specified by delta.
  pan(delta: ViewportCoord) {
    this.originOffset.x += delta.x / this.zoomScale;
    this.originOffset.y += delta.y / this.zoomScale;
    this.notifyListeners();
  }

  deselectCards() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards.get(i).selected = false;
    }
  }

  getCardById(id: string): Card {
    // TODO(eyuelt): change CollaborativeList to CollaborativeMap
    let cardsArray = this.cards.asArray();
    for (let card of cardsArray) {
      if (card.id === id) {
        return card;
      }
    }
    return null;
  }

  connectArrowAndCard(arrow: Arrow, card: Card, arrowConnection: ArrowConnectionType) {
    if (arrowConnection === ArrowConnectionType.INCOMING) {
      if (arrow.toCard) {
        arrow.toCard.incomingArrows.removeValue(arrow);
      }
      arrow.toCard = card;
      card.incomingArrows.push(arrow);
    } else if (arrowConnection === ArrowConnectionType.OUTGOING) {
      if (arrow.fromCard) {
        arrow.fromCard.outgoingArrows.removeValue(arrow);
      }
      arrow.fromCard = card;
      card.outgoingArrows.push(arrow);
    }
  }

  // TODO(eyuelt): Get rid of this listener stuff. Instead, the objects that
  // want to listen should just register with realtime for changes to the scale
  // or originOffset properties of the canvasService.
  addListener(listener: {(): void}) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
