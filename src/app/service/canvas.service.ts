import {Injectable} from '@angular/core';
import {
  GoogleRealtimeService,
} from './google-realtime.service';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import { Card } from '../model/card';
import { Arrow } from '../model/arrow';
import { Point } from '../model/geometry';

// NOTE: These type aliases are not type-checked. They are just for readability.
// TODO(eyuelt): is there a way of getting these type-checked?
// A point in the coordinate system of the viewport.
export type ViewportCoord = Point;
// A point in the coordinate system of the canvas.
export type CanvasCoord = Point;

// Specifies the type of connection an arrow has to a card. Note that an arrow
// may be connected to up to two cards, so it could have an INCOMING connection
// and an OUTGOING connection.
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
@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  // The models of the cards to show on the canvas.
  cards: CollaborativeList<Card>|undefined;
  // The models of the arrows to show on the canvas.
  arrows: CollaborativeList<Arrow>|undefined;

  // The zoom scale relative to the original viewport size.
  zoomScale = 1;
  // The offset of the viewport from its original position.
  originOffset: CanvasCoord = {x: 0, y: 0};
  // If true, multipe
  multiSelectMode = false;
  // These are the keyboard keys that enable multi-select
  MULTI_SELECT_KEY_CODES: string[] = [
    'MetaLeft',  // Left cmd button on Mac
    'MetaRight'  // Right cmd button on Mac
  ];
  // TODO(eyuelt): I think I can use RXJS' Subject for this?
  // The list of functions to call when zoom or pan occurs. This is used to
  // essentially watch this class' properties.
  private listeners: (() => void)[] = [];
  // The min and max zoom scales.
  private kMinZoomScale = 0.1;
  private kMaxZoomScale = 10.0;

  // A reference to the Realtime Document. Used here to create Cards and Arrows.
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      this.realtimeDocument = currentDocument;
      if (currentDocument === null) {
        return;
      }

      const model = currentDocument.getModel();

      // Lazily instantiate the collaborative cards array.
      if (model.getRoot().get('cards') === null) {
        console.log('no "cards" object at root');
        const collaborativeCards = model.createList([]);
        model.getRoot().set('cards', collaborativeCards);
      }

      this.cards = model.getRoot().get('cards');

      // Lazily instantiate the collaborative arrows array.
      if (model.getRoot().get('arrows') === null) {
        console.log('no "arrows" object at root');
        const collaborativeArrows = model.createList([]);
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
    if (this.cards) {
      for (let i = 0; i < this.cards.length; i++) {
        this.cards.get(i).selected = false;
      }
    }
  }

  getCardById(id: string): Card|null {
    // TODO(eyuelt): change CollaborativeList to CollaborativeMap
    if (this.cards) {
      const cardsArray = this.cards.asArray();
      for (const card of cardsArray) {
        if (card.id === id) {
          return card;
        }
      }
    }
    return null;
  }

  // Creates a card and adds it to the canvas.
  addCard(position: Point = {x: 0, y: 0},
          text: string = '',
          selected = false): Card|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model) {
        const card = model.create(Card);
        card.position = position;
        card.text = text;
        card.selected = selected;
        model.getRoot().get('cards').push(card);  // TODO(eyuelt): shouldn't we be adding directly to this.cards?
        return card;
      }
    }
    return null;
  }

  // Creates an arrow and adds it to the canvas.
  addArrow(tailPosition: Point = {x: 0, y: 0},
           tipPosition: Point = {x: 0, y: 0}): Arrow|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model) {
        const arrow = model.create(Arrow);
        arrow.tailPosition = tailPosition;
        arrow.tipPosition = tipPosition;
        model.getRoot().get('arrows').push(arrow);  // TODO(eyuelt): same as above
        return arrow;
      }
    }
    return null;
  }

  connectArrowAndCard(arrow: Arrow, card: Card,
                      arrowConnection: ArrowConnectionType) {
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

  // Repositions the given arrow's tail and tip based on its attached cards.
  repositionArrow(arrow: Arrow) {
    if (!arrow.fromCard && !arrow.toCard) {
      return;
    }
    if (arrow.toCard) {
      arrow.tipPosition = {
        x: arrow.toCard.position.x,
        y: arrow.toCard.position.y + arrow.toCard.size.height / 2
      };
      if (arrow.fromCard === null) {
        arrow.tailPosition = {
          x: arrow.toCard.position.x - 50,
          y: arrow.toCard.position.y + arrow.toCard.size.height / 2
        };
      }
    }
    if (arrow.fromCard) {
      arrow.tailPosition = {
        x: arrow.fromCard.position.x + arrow.fromCard.size.width,
        y: arrow.fromCard.position.y + arrow.fromCard.size.height / 2
      };
      if (arrow.toCard === null) {
        arrow.tipPosition = {
          x: arrow.fromCard.position.x + arrow.fromCard.size.width + 50,
          y: arrow.fromCard.position.y + arrow.fromCard.size.height / 2
        };
      }
    }
  }

  // TODO(eyuelt): Get rid of this listener stuff. Instead, the objects that
  // want to listen should just register with realtime for changes to the scale
  // or originOffset properties of the canvasService.
  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  // This function calls the given function within a Realtime compound
  // operation, which treats the function as a transaction.
  realtimeTransaction(fn: () => void) {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      model.beginCompoundOperation();
      fn();
      model.endCompoundOperation();
    }
  }
}
