import { Injectable } from '@angular/core';
import '../../shared/card/card';

// TODO(eyuelt): where should this be defined?
export interface Point {
  x:number;
  y:number;
}

// NOTE: These type aliases are not type-checked. They are just for readability.
// TODO(eyuelt): is there a way of getting these type-checked?
// A point in the coordinate system of the viewport.
export type ViewportCoord = Point;
// A point in the coordinate system of the canvas.
export type CanvasCoord = Point;

/**
 * The CanvasService maintains the data of the cards to show on the canvas,
 * handles zooming and panning on the canvas.
 * Zooming grows and shrinks the viewport relative to the canvas and panning
 * translates the viewport relative to the canvas.
 * This class also handles converting between the viewport's coordinate system,
 * the size of which is specified by viewportSize, and the canvas' coordinate
 * system, which is infinitely large.
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
  // The offset from the original viewport position.
  centerOffset: CanvasCoord = {x:0, y:0};
  // The size of the viewport. Must match the sizes specified in html and css.
  viewportSize = {w:400, h:400};
  // TODO(eyuelt): I think I can use RXJS' Subject for this?
  // The list of functions to call when zoom or pan occurs. This is used to
  // essentially watch this class' properties.
  listeners: {():void}[] = [];

  constructor() {
    // TODO(eyuelt): fetch this card data from wherever it's stored
    this.cards.push(new Card(-100, -100, 20));
    this.cards.push(new Card(0, 0, 20));
    this.cards.push(new Card(20, 20, 20));
    this.cards.push(new Card(60, 60, 20));
  }

  // Convert a point in the viewport coordinate space to a point in the canvas
  // coordinate space.
  viewportCoordToCanvasCoord(vp: ViewportCoord): CanvasCoord {
    const x = (vp.x - this.viewportSize.w/2) / this.zoomScale + this.centerOffset.x;
    const y = (vp.y - this.viewportSize.h/2) / this.zoomScale + this.centerOffset.y;
    return {x, y};
  }

  // Convert a point in the canvas coordinate space to a point in the viewport
  // coordinate space.
  canvasCoordToViewportCoord(cv: CanvasCoord): ViewportCoord {
    const x = (cv.x - this.centerOffset.x) * this.zoomScale + this.viewportSize.w/2;
    const y = (cv.y - this.centerOffset.y) * this.zoomScale + this.viewportSize.h/2;
    return {x, y};
  }

  // Zoom the canvas incrementally by incZoomScale, while keeping zoomPnt at
  // the same position relative to the viewport.
  zoom(zoomPnt: ViewportCoord, incZoomScale: number) {
    const toZoom = this.zoomScale * incZoomScale;
    if (toZoom > this.kMinZoomScale && toZoom < this.kMaxZoomScale) {
      this.centerOffset.x += (zoomPnt.x - this.viewportSize.w/2) * (1 - (1 / incZoomScale)) / this.zoomScale;
      this.centerOffset.y += (zoomPnt.y - this.viewportSize.h/2) * (1 - (1 / incZoomScale)) / this.zoomScale;
      this.zoomScale = toZoom;
      this.notifyListeners();
    }
  }

  // Pan the canvas by the vector specified by delta.
  pan(delta: ViewportCoord) {
    this.centerOffset.x += delta.x / this.zoomScale;
    this.centerOffset.y += delta.y / this.zoomScale;
    this.notifyListeners();
  }

  addListener(listener: {():void}) { this.listeners.push(listener); }
  notifyListeners() { this.listeners.forEach((listener) => { listener(); }); }
}
