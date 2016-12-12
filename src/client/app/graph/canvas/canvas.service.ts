import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import '../card/card';
import {ADD_CARDS} from '../../reducer/cards.reducer';
import {Observable} from 'rxjs';
import {CARDS} from '../../reducer/reducer-constants';

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
  cards: Observable<Card[]>;
  // The zoom scale relative to the original viewport size.
  zoomScale: number = 1;
  // Returns the bounding box of the canvas.
  getCanvasBounds: {():ClientRect} = null;
  // The offset of the viewport from its original position.
  originOffset: CanvasCoord = {x:0, y:0};
  // TODO(eyuelt): I think I can use RXJS' Subject for this?
  // The list of functions to call when zoom or pan occurs. This is used to
  // essentially watch this class' properties.
  private listeners: {():void}[] = [];
  // The min and max zoom scales.
  private kMinZoomScale: number = 0.1;
  private kMaxZoomScale: number = 10.0;

  constructor(private store: Store<any>) {
    // Subscribe "this.cards" to whatever's in the Store.
    this.cards = store.select<Card[]>(CARDS);

    // Add a bunch of cards to the Store.
    // Should automatically update "this.cards".
    store.dispatch({ type: ADD_CARDS, payload: [
      new Card(0, 0, 'You get a card!'),
      new Card(60, 60, '... and you get a card!'),
      new Card(100, 100, '... and you get a card!'),
      new Card(200, 200, '... and you get a card!')
    ] });
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
  setCanvasBoundsGetter(fn: {():ClientRect}) {
    this.getCanvasBounds = fn;
  }

  addListener(listener: {():void}) { this.listeners.push(listener); }
  notifyListeners() { this.listeners.forEach((listener) => { listener(); }); }
}
