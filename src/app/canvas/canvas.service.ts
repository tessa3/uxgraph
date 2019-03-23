import {Injectable} from '@angular/core';
import { Card } from '../model/card';
import { Arrow } from '../model/arrow';
import { Point } from '../model/geometry';
import {
  CanvasElementManagerService,
  ArrowConnectionType,
} from './canvas-element-manager/canvas-element-manager.service';

// NOTE: These type aliases are not type-checked. They are just for readability.
// TODO(eyuelt): is there a way of getting these type-checked?
// Follow up from future me: Yes, classes! Duh! They should both implement the
// Point interface and provide methods to convert between each other.
// TODO(eyuelt): move these to geometry.ts
//
// A point in the coordinate system of the viewport.
export type ViewportCoord = Point;
// A point in the coordinate system of the canvas.
export type CanvasCoord = Point;

// TODO(eyuelt): this class should only handle UI stuff like pan, zoom, select.
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
  cards: Card[] = [];
  // The models of the arrows to show on the canvas.
  arrows: Arrow[] = [];

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

  // TODO(eyuelt): This is a stop gap solution. This class actually should not
  // know about the element manager. The canvas elements should talk directly to
  // it. This class should not own the data for the elements. It just handles
  // the UI stuff like zooming and panning.
  constructor(private canvasElementManager: CanvasElementManagerService) {
    canvasElementManager.letmeknow(this.updateCanvasElements.bind(this));
  }

  updateCanvasElements() {
    this.cards = this.canvasElementManager.getCards();
    this.arrows = this.canvasElementManager.getArrows();
    this.notifyListeners();
  }

  // TODO(eyuelt): move this to the Point subclasses
  // Convert a point in the viewport coordinate space to a point in the canvas
  // coordinate space.
  viewportCoordToCanvasCoord(vp: ViewportCoord): CanvasCoord {
    const x = vp.x / this.zoomScale + this.originOffset.x;
    const y = vp.y / this.zoomScale + this.originOffset.y;
    return {x, y};
  }

  // TODO(eyuelt): move this to the Point subclasses
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
        this.cards[i].selected = false;
      }
    }
  }

  // TODO(eyuelt): move this
  getCardById(id: string): Card|null {
    // TODO(eyuelt): change CollaborativeList to CollaborativeMap
    if (this.cards) {
      const cardsArray = this.cards;
      for (const card of cardsArray) {
        if (card.id === id) {
          return card;
        }
      }
    }
    return null;
  }

  // TODO(eyuelt): move this
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

  // TODO(eyuelt): move this
  // connects the arrow to the card and repositions it
  arrowTipDroppedOnCard(arrow: Arrow, cardId: string) {
    if (cardId !== null) {
      console.log('clicked on card id: ' + cardId);
      const card = this.getCardById(cardId);
      if (card !== null) {
        this.canvasElementManager.connectArrowAndCard(arrow, card, ArrowConnectionType.INCOMING);
        this.repositionArrow(arrow);
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
}
