import {Component, HostListener, ElementRef} from '@angular/core';
import {CanvasInteractionService, ViewportCoord} from '../canvas-interaction.service';
import {EventUtils} from '../../utils/event-utils';
import { CanvasElementService } from '../canvas-element.service';

/**
 * This class represents the Canvas component.
 */
@Component({
  selector: 'uxg-canvas',
  templateUrl: 'canvas.component.html',
  styleUrls: ['canvas.component.css'],
  providers: [CanvasInteractionService]
})
export class CanvasComponent {
  // Whether or not panning is in progress.
  private panning = false;
  // The last point seen during the pan that is currently in progress.
  private lastPanPnt: ViewportCoord|null = null;

  /*
   * Note: The following two methods are properties because they are defined at
   * runtime in the constructor because they need access to ElementRef. This
   * allows us to use ElementRef without exposing it to the rest of the class.
   */
  // Returns the bounding box of the canvas.
  private getBounds: (() => ClientRect);
  // Returns whether the target of the given event is the canvas.
  private eventTargetIsCanvas: ((event: Event) => boolean);

  // Note: ElementRef should be treated as read-only to avoid XSS vulnerabilites
  constructor(elementRef: ElementRef,
              private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
    this.getBounds = () => {
      return elementRef.nativeElement.getBoundingClientRect();
    };
    this.eventTargetIsCanvas = (event) => {
      // target is either uxg-canvas container or svg child
      return event.target === elementRef.nativeElement ||
        event.target === elementRef.nativeElement.firstChild;
    };
  }

  // TODO(eyuelt): should this use HostListener or the template event binding?
  onMousewheel(event: WheelEvent) {
    event.preventDefault();
    const zoomScale = 1 + (event.deltaY * -0.002);
    const zoomPnt = {
      x: event.clientX - this.getBounds().left,
      y: event.clientY - this.getBounds().top
    };
    this.canvasInteractionService.zoom(zoomPnt, zoomScale);
  }

  onMousedown(event: MouseEvent) {
    if (this.eventTargetIsCanvas(event) &&
        EventUtils.eventIsFromPrimaryButton(event)) {
      this.panning = true;
      this.lastPanPnt = {
        x: event.clientX - this.getBounds().left,
        y: event.clientY - this.getBounds().top
      };
    }
  }

  // Put mousemove on document to allow panning outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    // TODO(eyuelt): We know lastPanPnt is defined if panning is true but we
    // shouldn't have these separate fields implicitly tied together like this.
    // What if somehow they get out of sync. Maybe create a CanvasPanner class?
    if (this.panning && this.lastPanPnt !== null) {
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
      this.canvasInteractionService.pan(panVector);
      this.lastPanPnt = newPanPnt;
    }
  }

  // Put mouseup on document to end pan even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.panning) {
      this.panning = false;
      this.lastPanPnt = null;
    }
  }

  // TODO add comment
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      if (this.canvasInteractionService.MULTI_SELECT_KEY_CODES.indexOf(event.code) > -1) {
        this.canvasInteractionService.multiSelectMode = true;
      }
  }

  // TODO add comment
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.canvasInteractionService.MULTI_SELECT_KEY_CODES.indexOf(event.code) > -1) {
      this.canvasInteractionService.multiSelectMode = false;
    }
  }

}
