import { Component, Input, HostListener } from '@angular/core';
import { CanvasInteractionService } from '../canvas-interaction.service';
import { EventUtils } from '../../utils/event-utils';
import { CanvasElementService, ArrowElementModel } from '../canvas-element.service';
import { ViewportDrag } from '../utils/viewport-drag';
import { ViewportCoord, CanvasCoord } from '../utils/coord';

// TODO: Arrow tail/tip positions should be determined by toCard/fromCard. The
// only time we should rely on tailPosition/tipPosition is when we're dragging.
// Otherwise, compute the position.
// E.g.:
//   get tipPosition() {
//     if  (this.tipDrag.isInProgress()) {
//       return this.arrow.tipPosition();
//     }
//     return this.arrow.toCard.incomingArrowPoint();
//   }
//
// Once this happens, we can get rid of the adjustConnectedArrows and
// repositionArrow logic in ElemModelUtils.

/**
 * This class represents the Arrow component.
 */
@Component({
  selector: '[uxg-arrow]',  // tslint:disable-line:component-selector
  templateUrl: 'arrow.component.html',
  styleUrls: ['arrow.component.css']
})
export class ArrowComponent {
  // The arrow data to render on the canvas.
  @Input() arrow!: ArrowElementModel;
  // A function pointer to the CanvasInteractionService's "getBounds()" function.
  @Input() canvasBoundsGetter!: (() => ClientRect);

  // The current scale factor of the arrow shape.
  get scale(): number {
    return this.canvasInteractionService.zoomScale;
  }
  // The current display position of the tip of the arrow.
  get tipPosition(): ViewportCoord {
    return this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.arrow.tipPosition.x, this.arrow.tipPosition.y));
  }

  // Represents the drag action on the tip of the arrow.
  private tipDrag: ViewportDrag = new ViewportDrag();

  constructor(private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
  }

  // Get the anchor points of the arrow based on the tailPosition and
  // tipPosition and convert them to the string format expected by SVG polyline.
  // TODO: change this to a property that gets updated whenever the tail/tip change.
  // otherwise, this function will get called every time the change detector runs
  getAnchorPointsString() {
    const canvasAnchorPoints = [
      new CanvasCoord(this.arrow.tailPosition.x, this.arrow.tailPosition.y),
      new CanvasCoord(this.arrow.tailPosition.x + 10, this.arrow.tailPosition.y),
      new CanvasCoord(this.arrow.tipPosition.x - 20, this.arrow.tipPosition.y),
      new CanvasCoord(this.arrow.tipPosition.x, this.arrow.tipPosition.y),
    ];
    return canvasAnchorPoints.map((coord: CanvasCoord) => {
      return this.canvasInteractionService.canvasCoordToViewportCoord(coord);
    }).reduce((accumulator: string, point) => {
      return accumulator + `${point.x},${point.y} `;
    }, '');
  }

  // TODO(eyuelt): increase arrow hitbox
  // TODO(eyuelt): put the mousedown listener on the tip of the arrow, otherwise
  // dragging anywhere on the arrow will move the tip
  onMousedown(event: MouseEvent) {
    if (EventUtils.eventIsFromPrimaryButton(event)) {
      const canvasBounds = this.canvasBoundsGetter();
      this.tipDrag.start(new ViewportCoord(
        event.clientX - canvasBounds.left,
        event.clientY - canvasBounds.top
      ));
    }
  }

  // Put mousemove on document to allow dragging outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.tipDrag.isInProgress()) {
      event.preventDefault();
      const canvasBounds = this.canvasBoundsGetter();
      const newDragPoint = new ViewportCoord(
        event.clientX - canvasBounds.left,
        event.clientY - canvasBounds.top
      );
      const dragVector = this.tipDrag.continue(newDragPoint);
      const newTipPosition =
        this.canvasInteractionService.viewportCoordToCanvasCoord(
          this.tipPosition.translated(dragVector));
      this.arrow.tipPosition = {x: newTipPosition.x, y: newTipPosition.y};
    }
  }

  // Finds the first element in the given list that is a descendant of a
  // uxg-card and returns the ancestor uxg-card element. Returns null if
  // no such element exists.
  // TODO(eyuelt): optimize this if needed
  // TODO(eyuelt): move this somewhere else
  private topCardElementFromList(elements: Element[]): Element|null {
    for (const element of elements) {
      let elem: Element|null = element;
      while (elem !== null) {
        if (elem.hasAttribute('uxg-card')) {
          return elem;
        }
        elem = elem.parentElement;
      }
    }
    return null;
  }

  // Put mouseup on document to end drag even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.tipDrag.isInProgress()) {
      const topCard = this.topCardElementFromList(document.elementsFromPoint(event.clientX, event.clientY));
      if (topCard !== null) {
        const cardId = topCard.getAttribute('card-id');
        if (cardId !== null) {
          this.canvasElementService.arrowTipDroppedOnCard(this.arrow, cardId);
        }
      }
      // TODO: If the click was on the canvas, disconnect the arrow from its
      // current card (if it has one).
      this.tipDrag.end();
    }
  }

}
