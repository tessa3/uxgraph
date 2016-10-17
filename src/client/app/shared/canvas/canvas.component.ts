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

  // TODO(eyuelt): should this use HostListener or the template event binding?
  onMousewheel(event: WheelEvent) {
    const zoomScale = 1 + (event.deltaY * -0.01);
    const zoomPnt = {
      x: event.offsetX,
      y: event.offsetY
    };
    this.canvasService.zoom(zoomPnt, zoomScale);
    event.stopPropagation();
    event.preventDefault();
  }

  onMousedown(event: MouseEvent) {
    this.panning = true;
    this.lastPanPnt = {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  onMousemove(event: MouseEvent) {
    if (this.panning) {
      const newPanPnt = {
        x: event.offsetX,
        y: event.offsetY
      };
      const panVector = {
        x: this.lastPanPnt.x - newPanPnt.x,
        y: this.lastPanPnt.y - newPanPnt.y
      };
      this.canvasService.pan(panVector);
      this.lastPanPnt = newPanPnt;
    }
  }

  // Put mouseup on document to cancel pan even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.panning = false;
    this.lastPanPnt = null;
  }
}
