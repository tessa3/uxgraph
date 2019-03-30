import { ViewportCoord, ViewportVector } from './coord';

// This class represents a drag action in the viewport's coordinate space.
export class ViewportDrag {
  private inProgress = false;
  private currentPosition: ViewportCoord = new ViewportCoord(0, 0);

  // Start the drag at the given point.
  start(point: ViewportCoord) {
    this.inProgress = true;
    this.currentPosition = point;
  }

  // Continues the drag to the newPoint. Returns the vector representing the
  // drag from the previous position to the current position.
  continue(newPoint: ViewportCoord): ViewportVector {
    const dragVector = new ViewportVector(
      newPoint.x - this.currentPosition.x,
      newPoint.y - this.currentPosition.y
    );
    this.currentPosition = newPoint;
    return dragVector;
  }

  // End the drag.
  end() {
    this.inProgress = false;
    this.currentPosition = new ViewportCoord(0, 0);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getCurrentPosition(): ViewportCoord {
    return this.currentPosition;
  }
}
