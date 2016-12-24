import {Injectable} from '@angular/core';
import {
  GoogleRealtimeService,
  Card
} from '../../service/google-realtime.service';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;

// TODO(eyuelt): move these to the data model layer
export interface Point {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}

// NOTE: These type aliases are not type-checked. They are just for readability.
// TODO(eyuelt): is there a way of getting these type-checked?
// A point in the coordinate system of the viewport.
export type ViewportCoord = Point;
// A point in the coordinate system of the canvas.
export type CanvasCoord = Point;


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
  cards: CollaborativeList<any>;

  // The zoom scale relative to the original viewport size.
  zoomScale: number = 1;
  // Returns the bounding box of the canvas.
  getCanvasBounds: {(): ClientRect} = null;
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

      // Lazily instantiate some collaborative cards.
      if (model.getRoot().get('cards') === null) {
        console.log('no "cards" object at root');
        let card1 = model.create(Card);
        card1.x = 30;
        card1.y = 30;
        card1.text = 'some text';
        card1.selected = false;

        let card2 = model.create(Card);
        card2.x = 100;
        card2.y = 100;
        card2.text = 'more text';
        card2.selected = false;

        let collaborativeCards = model.createList([card1, card2]);
        model.getRoot().set('cards', collaborativeCards);
      }

      this.cards = model.getRoot().get('cards');
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
  zoom(zoomPnt: ViewportCoord, incZoomScale: number) {
    const toZoom = this.zoomScale * incZoomScale;
    if (toZoom > this.kMinZoomScale && toZoom < this.kMaxZoomScale) {
      this.originOffset.x +=
          zoomPnt.x * (1 - (1 / incZoomScale)) / this.zoomScale;
      this.originOffset.y +=
          zoomPnt.y * (1 - (1 / incZoomScale)) / this.zoomScale;
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

  // Set the function that returns the canvas' bounding box.
  setCanvasBoundsGetter(fn: {(): ClientRect}) {
    this.getCanvasBounds = fn;
  }

  deselectCards() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards.get(i).selected = false;
    }
  }

  addListener(listener: {(): void}) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
