import {Component, HostListener, ElementRef} from '@angular/core';
import {CanvasService, ViewportCoord} from './canvas.service';
import {EventUtils} from '../../utils/event-utils';
import {CardSelectionService} from "../../service/card-selection.service";

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
  private panning: boolean = false;
  // The last point seen during the pan that is currently in progress.
  private lastPanPnt: ViewportCoord = null; //TODO(eyuelt): make this nullable after TS2 update

  /*
   * Note: The following two methods are properties because they are defined at
   * runtime in the constructor because they need access to ElementRef. This
   * allows us to use ElementRef without exposing it to the rest of the class.
   */
  // Returns the bounding box of the canvas.
  private getBounds: (() => ClientRect) = null;
  // Returns whether the target of the given event is the canvas.
  private eventTargetIsCanvas: ((event:Event) => boolean) = null;

  // Note: ElementRef should be treated as read-only to avoid XSS vulnerabilites
  constructor(elementRef: ElementRef,
              private canvasService: CanvasService,
              private cardSelectionService: CardSelectionService) {
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
    this.canvasService.zoom(zoomPnt, zoomScale);
  }

  onMousedown(event: MouseEvent) {
    if (this.eventTargetIsCanvas(event) &&
        EventUtils.eventIsFromPrimaryButton(event)) { // TODO this isn't proving "panning" (could just be a click)
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
    if (this.panning) {
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
      this.panning = false;
      this.lastPanPnt = null;
    }
    if (this.eventTargetIsCanvas(event)) {
      // TODO if not panning
      // TODO what if they're defining the bounds for a selection?
      this.cardSelectionService.clearSelection();
    }
  }

  // TODO add comment
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      if (this.canvasService.MULTI_SELECT_KEY_CODES.indexOf(event.code) > -1) {
        this.canvasService.multiSelectMode = true;
      }
  }

  // TODO add comment
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.canvasService.MULTI_SELECT_KEY_CODES.indexOf(event.code) > -1) {
      this.canvasService.multiSelectMode = false;
    }
  }

}
