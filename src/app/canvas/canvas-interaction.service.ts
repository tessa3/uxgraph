import { Injectable } from '@angular/core';
import { CanvasCoord, ViewportCoord, ViewportVector } from './utils/coord';

/*
 * The CanvasInteractionService handles zooming and panning on the canvas.
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
export class CanvasInteractionService {
  // The zoom scale relative to the original viewport size.
  zoomScale = 1;
  // The offset of the viewport from its original position.
  originOffset: CanvasCoord = new CanvasCoord(0, 0);
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

  constructor() {}

  // Convert a point in the viewport coordinate space to a point in the canvas
  // coordinate space.
  viewportCoordToCanvasCoord(vp: ViewportCoord): CanvasCoord {
    return new CanvasCoord(
      vp.x / this.zoomScale + this.originOffset.x,
      vp.y / this.zoomScale + this.originOffset.y
    );
  }

  // Convert a point in the canvas coordinate space to a point in the viewport
  // coordinate space.
  canvasCoordToViewportCoord(cv: CanvasCoord): ViewportCoord {
    return new ViewportCoord(
      (cv.x - this.originOffset.x) * this.zoomScale,
      (cv.y - this.originOffset.y) * this.zoomScale
    );
  }

  // Zoom the canvas incrementally by incZoomScale, while keeping zoomPnt at
  // the same position relative to the viewport.
  zoom(zoomPoint: ViewportCoord, incrementalZoomScale: number) {
    const toZoom = this.zoomScale * incrementalZoomScale;
    if (toZoom > this.kMinZoomScale && toZoom < this.kMaxZoomScale) {
      // TODO(eyuelt): make this clearer
      this.originOffset.x +=
          zoomPoint.x * (1 - (1 / incrementalZoomScale)) / this.zoomScale;
      this.originOffset.y +=
          zoomPoint.y * (1 - (1 / incrementalZoomScale)) / this.zoomScale;
      this.zoomScale = toZoom;
      this.notifyListeners();
    }
  }

  // Pan the canvas by the vector specified by delta.
  pan(delta: ViewportVector) {
    this.originOffset.x += delta.x / this.zoomScale;
    this.originOffset.y += delta.y / this.zoomScale;
    this.notifyListeners();
  }

  // TODO(eyuelt): Get rid of this listener stuff. Instead, the objects that
  // want to listen should just register with realtime for changes to the scale
  // or originOffset properties of the canvasInteractionService.
  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
