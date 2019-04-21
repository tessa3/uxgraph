import { Point } from '../../model/geometry';


// This class wraps the subclass constructors that the Coord and Vector classes.
abstract class CoordinateSystem<C extends Coord<any, C, V>, V extends Vector<any, V>> {
  abstract coordClass: { new(x: number, y: number): C };
  abstract vectorClass: { new(x: number, y: number): V };
}
class Viewport extends CoordinateSystem<ViewportCoord, ViewportVector> {
  coordClass = ViewportCoord;  // tslint:disable-line:no-use-before-declare
  vectorClass = ViewportVector;  // tslint:disable-line:no-use-before-declare
  // This is to make the shapes of the Viewport and Canvas classes different
  // from each other so the compiler won't implicitly convert between them.
  isViewport = true;
}
class Canvas extends CoordinateSystem<CanvasCoord, CanvasVector> {
  coordClass = CanvasCoord;  // tslint:disable-line:no-use-before-declare
  vectorClass = CanvasVector;  // tslint:disable-line:no-use-before-declare
  // This is to make the shapes of the Viewport and Canvas classes different
  // from each other so the compiler won't implicitly convert between them.
  isCanvas = true;
}


// A vector in some coordinate system, as specified by CS.
abstract class Vector<CS extends CoordinateSystem<any, V>, V extends Vector<CS, V>> implements Point {
  abstract coordinateSystemConstructor: { new(): CS };

  get coordSystem(): CS {
    return new this.coordinateSystemConstructor();
  }

  constructor(public x: number, public y: number) {}

  // Returns a copy of this Vector rotated 180 degrees.
  reversed(): V {
    return new this.coordSystem.vectorClass(-this.x, -this.y);
  }
}

// A vector in the coordinate system of the viewport.
export class ViewportVector extends Vector<Viewport, ViewportVector> {
  coordinateSystemConstructor = Viewport;
}

// A vector in the coordinate system of the canvas.
export class CanvasVector extends Vector<Canvas, CanvasVector> {
  coordinateSystemConstructor = Canvas;
}


// A point in some coordinate system, as specified by CS.
abstract class Coord<CS extends CoordinateSystem<C, V>,
                     C extends Coord<CS, C, V>,
                     V extends Vector<CS, V>
                    > implements Point {
  abstract coordinateSystemConstructor: { new(): CS };

  get coordSystem(): CS {
    return new this.coordinateSystemConstructor();
  }

  constructor(public x: number, public y: number) {}

  // Returns a copy of this ViewportCoord translated by the given vector.
  translated(vector: V): C {
    return new this.coordSystem.coordClass(this.x + vector.x, this.y + vector.y);
  }
  // Same as above but only translates the x component.
  translatedX(x: number): C {
    return this.translated(new this.coordSystem.vectorClass(x, 0));
  }
  // Same as above but only translates the y component.
  translatedY(y: number): C {
    return this.translated(new this.coordSystem.vectorClass(0, y));
  }
}

// A point in the coordinate system of the viewport.
export class ViewportCoord extends Coord<Viewport, ViewportCoord, ViewportVector> {
  coordinateSystemConstructor = Viewport;
}

// A point in the coordinate system of the canvas.
export class CanvasCoord extends Coord<Canvas, CanvasCoord, CanvasVector> {
  coordinateSystemConstructor = Canvas;

  static fromPoint(point: Point): CanvasCoord {
    return new CanvasCoord(point.x, point.y);
  }
}
