import { Component } from '@angular/core';
import { CardComponent } from '../../shared/index';
import { CanvasService } from './canvas.service'; // Why doesn't ./index work?

/**
 * This class represents the Canvas component.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-canvas',
  templateUrl: 'canvas.component.html',
  styleUrls: ['canvas.component.css'],
  directives: [CardComponent],
  providers: [CanvasService]
})
export class CanvasComponent {
  // Whether or not panning is in progress.
  panning: boolean = false;
  // The last point seen during the pan that is currently in progress.
  lastPanPnt: Point|undefined = null;

  constructor(public canvasService: CanvasService) {
  }

  getCanvasBounds() {
    // TODO(eyuelt): how to do getClientRects without accessing html elem?
    //return canvas.getClientRects()[0];
    return {top:0, left:0, bottom:0, right:0};
  }

  onMousewheel(event: Event) {
    const canvasBounds = this.getCanvasBounds();
    const zoomScale = 1 + (event.deltaY * -0.01);
    const zoomPnt = {
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top
    };
    this.canvasService.zoom(zoomPnt, zoomScale);
    event.stopPropagation();
    event.preventDefault();
  }

  onMousedown(event: Event) {
    const canvasBounds = this.getCanvasBounds();
    this.panning = true;
    this.lastPanPnt = {
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top
    };
  }

  // TODO(eyuelt): put this on window to handle the mouse leaving the canvas
  onMousemove(event: Event) {
    if (this.panning) {
      const canvasBounds = this.getCanvasBounds();
      const newPanPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      const panVector = {
        x: this.lastPanPnt.x - newPanPnt.x,
        y: this.lastPanPnt.y - newPanPnt.y
      };
      this.canvasService.pan(panVector);
      this.lastPanPnt = newPanPnt;
    }
  }

  // TODO(eyuelt): put this on window to handle the mouse leaving the canvas
  onMouseup(event: Event) {
    this.panning = false;
    this.lastPanPnt = null;
  }
}
