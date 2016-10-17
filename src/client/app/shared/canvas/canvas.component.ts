import { Component, HostListener } from '@angular/core';
import { CardComponent } from '../../shared/index';
import { CanvasService, Point } from './canvas.service';

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
  lastPanPnt: Point = null; //TODO(eyuelt): make this nullable after TS2 update

  constructor(public canvasService: CanvasService) {
  }

  getCanvasBounds() {
    // TODO(eyuelt): how to do getClientRects without accessing html elem?
    //return canvas.getClientRects()[0];
    return {top:0, left:0, bottom:0, right:0};
  }

  // TODO(eyuelt): should this use HostListener or the template event binding?
  onMousewheel(event: WheelEvent) {
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

  onMousedown(event: MouseEvent) {
    const canvasBounds = this.getCanvasBounds();
    this.panning = true;
    this.lastPanPnt = {
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
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

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.panning = false;
    this.lastPanPnt = null;
  }
}
