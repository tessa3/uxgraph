import { Component, HostListener, ElementRef } from '@angular/core';
import { CanvasInteractionService } from '../canvas-interaction.service';
import { EventUtils } from '../../utils/event-utils';
import { CanvasElementService } from '../canvas-element.service';
import { ViewportDrag } from '../utils/viewport-drag';
import { ViewportCoord } from '../utils/coord';

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
  // Represents the drag action on the canvas that is used to pan.
  private canvasDrag: ViewportDrag = new ViewportDrag();

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
    const zoomPnt = new ViewportCoord(
      event.clientX - this.getBounds().left,
      event.clientY - this.getBounds().top
    );
    this.canvasInteractionService.zoom(zoomPnt, zoomScale);
  }

  onMousedown(event: MouseEvent) {
    if (this.eventTargetIsCanvas(event) &&
        EventUtils.eventIsFromPrimaryButton(event)) {
      this.canvasDrag.start(new ViewportCoord(
        event.clientX - this.getBounds().left,
        event.clientY - this.getBounds().top
      ));
    }
  }

  // Put mousemove on document to allow panning outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.canvasDrag.isInProgress()) {
      event.preventDefault();
      const newPanPnt = new ViewportCoord(
        event.clientX - this.getBounds().left,
        event.clientY - this.getBounds().top
      );
      // Reverse because panning goes in opposite direction of the drag gesture.
      const panVector = this.canvasDrag.continue(newPanPnt).reversed();
      this.canvasInteractionService.pan(panVector);
    }
  }

  // Put mouseup on document to end pan even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.canvasDrag.isInProgress()) {
      this.canvasDrag.end();
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
