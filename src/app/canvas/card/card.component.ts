import {
  Component,
  Input,
  OnInit,
  HostListener,
} from '@angular/core';
import {
  CanvasInteractionService,
  ViewportCoord,
} from '../canvas-interaction.service';
import {EventUtils} from '../../utils/event-utils';
import { Card } from '../../model/card';
import {Arrow} from '../../model/arrow';
import { CanvasElementService } from '../canvas-element.service';

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
  @Input() card!: Card;

  // A function pointer to the CanvasInteractionService's "getBounds()" function.
  @Input() canvasBoundsGetter!: (() => ClientRect);

  // The current scale factor of the card shape.
  scale = 1;
  // The current display position in the viewport's coordinate space.
  position: ViewportCoord = {x: 0, y: 0};
  // The radius of the rounded corners in the canvas' coordinate space.
  cornerRadius = 1;

  // Whether or not dragging is in progress.
  private dragging = false;
  // The last point seen during the drag that is currently in progress.
  private lastDragPnt: ViewportCoord|null = null;

  constructor(private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
  }

  ngOnInit() {
    this.position = this.canvasInteractionService.canvasCoordToViewportCoord(this.card.position);
    this.canvasInteractionService.addListener(this.update.bind(this));
    // TODO(eyuelt): why isn't change detection automatically handling this?
    this.canvasElementService.addListener(this.update.bind(this));
  }

  // Called by the CanvasInteractionService when a zoom or pan occurs or when the
  // CanvasInteractionService is told that the elements data may have been changed.
  update() {
    this.scale = this.canvasInteractionService.zoomScale;
    this.position = this.canvasInteractionService.canvasCoordToViewportCoord(this.card.position);
  }

  onMousedown(event: MouseEvent) {
    if (EventUtils.eventIsFromPrimaryButton(event)
        // Don't initiate a drag if initiated from within the card's <textarea>.
        && !(event.target instanceof HTMLTextAreaElement)) {
      this.dragging = true;
      const canvasBounds = this.canvasBoundsGetter();
      this.lastDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      if (!this.canvasInteractionService.multiSelectMode) {
        this.canvasElementService.deselectCards();
      }
      this.card.selected = !this.card.selected;
    }
  }

  // Put mousemove on document to allow dragging outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    // TODO(eyuelt): see comment about CanvasPanner in canvas.component.ts.
    if (this.dragging && this.lastDragPnt !== null) {
      event.preventDefault();
      const canvasBounds = this.canvasBoundsGetter();
      const newDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      this.position.x += newDragPnt.x - this.lastDragPnt.x;
      this.position.y += newDragPnt.y - this.lastDragPnt.y;
      const newCardPosition =
        this.canvasInteractionService.viewportCoordToCanvasCoord(this.position);
      this.card.position = {x: newCardPosition.x, y: newCardPosition.y};
      // Move all associated arrows too
      // TODO(eyuelt): instead, have arrows subscribe to card position changes
      this.card.incomingArrows.asArray().forEach((arrow: Arrow) => {
        this.canvasElementService.repositionArrow(arrow);
      });
      this.card.outgoingArrows.asArray().forEach((arrow: Arrow) => {
        this.canvasElementService.repositionArrow(arrow);
      });
      this.lastDragPnt = newDragPnt;
    }
  }

  // Put mouseup on document to end drag even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.lastDragPnt = null;
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
