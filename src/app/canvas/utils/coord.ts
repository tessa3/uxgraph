import { Point } from '../../model/geometry';

// A point in the coordinate system of the viewport.
export class ViewportCoord implements Point {
  constructor(public x: number, public y: number) {}

  // Returns a copy of this ViewportCoord translated by the given vector.
  translated(vector: ViewportVector): ViewportCoord {
    return new ViewportCoord(this.x + vector.x, this.y + vector.y);
  }
}

// A point in the coordinate system of the canvas.
export class CanvasCoord implements Point {
  constructor(public x: number, public y: number) {}
}

// A vector in the coordinate system of the viewport.
export class ViewportVector implements Point {
  constructor(public x: number, public y: number) {}

  // Returns a copy of this Vector rotated 180 degrees.
  reversed(): ViewportVector {
    return new ViewportVector(-this.x, -this.y);
  }
}
