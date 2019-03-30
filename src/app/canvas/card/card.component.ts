import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CanvasInteractionService } from '../canvas-interaction.service';
import { EventUtils } from '../../utils/event-utils';
import { CanvasElementService, CardElementModel } from '../canvas-element.service';
import { ViewportDrag } from '../utils/viewport-drag';
import { ViewportCoord, CanvasCoord } from '../utils/coord';

/**
 * This class represents the Card component.
 */
@Component({
  selector: '[uxg-card]',  // tslint:disable-line:component-selector
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css']
})
export class CardComponent implements OnInit {

  // The card data to render on the canvas.
  @Input() card!: CardElementModel;

  // A function pointer to the CanvasInteractionService's "getBounds()" function.
  @Input() canvasBoundsGetter!: (() => ClientRect);

  // The current scale factor of the card shape.
  scale = 1;
  // The current display position in the viewport's coordinate space.
  position = new ViewportCoord(0, 0);
  // The radius of the rounded corners in the canvas' coordinate space.
  cornerRadius = 1;

  // Represents the drag action on the card.
  private drag: ViewportDrag = new ViewportDrag();

  constructor(private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
  }

  ngOnInit() {
    this.position = this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.card.position.x, this.card.position.y));
    this.canvasInteractionService.addListener(this.update.bind(this));
    // TODO(eyuelt): why isn't change detection automatically handling this?
    this.canvasElementService.addListener(this.update.bind(this));
  }

  // Called by the CanvasInteractionService when a zoom or pan occurs or when the
  // CanvasInteractionService is told that the elements data may have been changed.
  update() {
    this.scale = this.canvasInteractionService.zoomScale;
    this.position = this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.card.position.x, this.card.position.y));
  }

  onMousedown(event: MouseEvent) {
    if (EventUtils.eventIsFromPrimaryButton(event)
        // Don't initiate a drag if initiated from within the card's <textarea>.
        && !(event.target instanceof HTMLTextAreaElement)) {
      const canvasBounds = this.canvasBoundsGetter();
      this.drag.start(new ViewportCoord(
        event.clientX - canvasBounds.left,
        event.clientY - canvasBounds.top
      ));
      if (!this.canvasInteractionService.multiSelectMode) {
        this.canvasElementService.deselectCards();
      }
      this.card.selected = !this.card.selected;
    }
  }

  // Put mousemove on document to allow dragging outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.drag.isInProgress()) {
      event.preventDefault();
      const canvasBounds = this.canvasBoundsGetter();
      const newDragPnt = new ViewportCoord(
        event.clientX - canvasBounds.left,
        event.clientY - canvasBounds.top
      );
      const dragVector = this.drag.continue(newDragPnt);
      this.position = this.position.translated(dragVector);
      this.card.position =
          this.canvasInteractionService.viewportCoordToCanvasCoord(this.position);
      // Move all associated arrows too
      this.canvasElementService.adjustConnectedArrows(this.card);
    }
  }

  // Put mouseup on document to end drag even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.drag.isInProgress()) {
      this.drag.end();
    }
  }

  onCardTextareaKeyup(textAreaValue: string) {
    this.card.text = textAreaValue;
  }

  onCardTextareaFocus() {
    this.canvasElementService.deselectCards();
    this.card.selected = true;
  }

}
