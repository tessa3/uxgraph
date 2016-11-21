import {Component, HostListener, ElementRef} from '@angular/core';
import {CanvasService, Point} from './canvas.service';

/**
 * This class represents the Canvas component.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-canvas',
  templateUrl: 'canvas.component.html',
  styleUrls: ['canvas.component.css'],
  providers: [CanvasService]
})
export class CanvasComponent {
  // Whether or not panning is in progress.
  panning: boolean = false;
  // The last point seen during the pan that is currently in progress.
  lastPanPnt: Point = null; //TODO(eyuelt): make this nullable after TS2 update
  // Returns the bounding box of the canvas.
  getBounds: {():ClientRect} = null;

  // Note: ElementRef should be treated as read-only to avoid XSS vulnerabilites
  constructor(elementRef: ElementRef, private canvasService: CanvasService) {
    this.getBounds = () => {
      return elementRef.nativeElement.getBoundingClientRect();
    };
    this.canvasService.setCanvasBoundsGetter(this.getBounds);
  }

  // TODO(eyuelt): should this use HostListener or the template event binding?
  onMousewheel(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();
    const zoomScale = 1 + (event.deltaY * -0.01);
    const zoomPnt = {
      x: event.clientX - this.getBounds().left,
      y: event.clientY - this.getBounds().top
    };
    this.canvasService.zoom(zoomPnt, zoomScale);
  }

  onMousedown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.panning = true;
    this.lastPanPnt = {
      x: event.clientX - this.getBounds().left,
      y: event.clientY - this.getBounds().top
    };
  }

  // Put mousemove on document to allow panning outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.panning) {
      event.stopPropagation();
      event.preventDefault();
      const newPanPnt = {
        x: event.clientX - this.getBounds().left,
        y: event.clientY - this.getBounds().top
      };
      // Panning is in the opposite direction of the drag gesture.
      const panVector = {
        x: this.lastPanPnt.x - newPanPnt.x,
        y: this.lastPanPnt.y - newPanPnt.y
      };
      this.canvasService.pan(panVector);
      this.lastPanPnt = newPanPnt;
    }
  }

  // Put mouseup on document to end pan even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.panning) {
      event.stopPropagation();
      event.preventDefault();
      this.panning = false;
      this.lastPanPnt = null;
    }
  }
}