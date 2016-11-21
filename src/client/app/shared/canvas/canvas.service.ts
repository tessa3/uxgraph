import { Injectable } from '@angular/core';
import '../../shared/card/card';

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
  kMinZoomScale: number = 0.1;
  kMaxZoomScale: number = 10.0;
  // The models of the cards to show on the canvas.
  cards: Card[] = [];
  // The zoom scale relative to the original viewport size.
  zoomScale: number = 1;
  // The offset of the viewport from its original position.
  originOffset: CanvasCoord = {x:0, y:0};
  // TODO(eyuelt): I think I can use RXJS' Subject for this?
  // The list of functions to call when zoom or pan occurs. This is used to
  // essentially watch this class' properties.
  listeners: {():void}[] = [];
  // Returns the bounding box of the canvas.
  getCanvasBounds: {():ClientRect} = null;

  constructor() {
    // TODO(eyuelt): fetch this card data from wherever it's stored
    this.cards.push(new Card(0, 0, 'This is a card'));
    this.cards.push(new Card(60, 60, 'Another card'));
    this.cards.push(new Card(100, 100, 'Another'));
    this.cards.push(new Card(200, 200, 'You get the point'));
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
