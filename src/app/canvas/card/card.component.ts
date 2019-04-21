import { Component, Input, HostListener } from '@angular/core';
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
export class CardComponent {

  // The card data to render on the canvas.
  @Input() card!: CardElementModel;

  // A function pointer to the CanvasInteractionService's "getBounds()" function.
  @Input() canvasBoundsGetter!: (() => ClientRect);

  // The current scale factor of the card shape.
  get scale(): number {
    return this.canvasInteractionService.zoomScale;
  }
  // The current display position in the viewport's coordinate space.
  get position(): ViewportCoord {
    return this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.card.position.x, this.card.position.y));
  }

  // The radius of the rounded corners in the canvas' coordinate space.
  // TODO: this should be defined as a constant somewhere
  cornerRadius = 1;

  // Represents the drag action on the card.
  private drag: ViewportDrag = new ViewportDrag();

  constructor(private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
    // TODO: Do this once we start using ChangeDetectorStrategy.OnPush, which we
    // can only do once we've changed all the @Inputs to be immutable.
    // // If a zoom or pan happens, we need to manually trigger change detection.
    // this.canvasInteractionService.addListener(changeDetectorRef.markForCheck.bind(this));
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
      this.card.position =
          this.canvasInteractionService.viewportCoordToCanvasCoord(
            this.position.translated(dragVector));
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
