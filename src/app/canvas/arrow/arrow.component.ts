import { Component, Input, HostListener } from '@angular/core';
import { CanvasInteractionService } from '../canvas-interaction.service';
import { EventUtils } from '../../utils/event-utils';
import { CanvasElementService, ArrowElementModel } from '../canvas-element.service';
import { ViewportDrag } from '../utils/viewport-drag';
import { ViewportCoord, CanvasCoord, ViewportVector } from '../utils/coord';
import { ElemModelUtils } from 'src/app/utils/elem-model-utils';

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
  get tipPosition(): CanvasCoord {
    let tipPos: CanvasCoord;
    if (this.arrow.tipPosition) {
      tipPos = CanvasCoord.fromPoint(this.arrow.tipPosition);
    } else if (this.arrow.toCard) {
      tipPos = ElemModelUtils.incomingArrowPoint(this.arrow.toCard);
    } else if (this.arrow.fromCard) {
      tipPos = ElemModelUtils.outgoingArrowPoint(this.arrow.fromCard).translatedX(50);
    } else {
      tipPos = new CanvasCoord(50, 0);
    }
    return tipPos;
  }

  // The current display position of the tail of the arrow.
  get tailPosition(): CanvasCoord {
    let tailPos: CanvasCoord;
    if (this.arrow.tailPosition) {
      tailPos = CanvasCoord.fromPoint(this.arrow.tailPosition);
    } else if (this.arrow.fromCard) {
      tailPos = ElemModelUtils.outgoingArrowPoint(this.arrow.fromCard);
    } else if (this.arrow.toCard) {
      tailPos = ElemModelUtils.incomingArrowPoint(this.arrow.toCard).translatedX(-50);
    } else {
      tailPos = new CanvasCoord(0, 0);
    }
    return tailPos;
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
  getAnchorPointsString(): string {
    const canvasAnchorPoints: CanvasCoord[] = [
      this.tailPosition,
      this.tailPosition.translatedX(10),
      this.tipPosition.translatedX(-20),
      this.tipPosition,
    ];
    return canvasAnchorPoints.map((point: CanvasCoord) => {
      return this.canvasInteractionService.canvasCoordToViewportCoord(point);
    }).reduce((accumulator: string, point) => {
      return accumulator + `${point.x},${point.y} `;
    }, '');
  }

  // Called from the template.
  getTipPositionInViewport(): ViewportCoord {
    return this.canvasInteractionService.canvasCoordToViewportCoord(this.tipPosition);
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
      const newTipPosition = this.tipPosition.translated(
        this.canvasInteractionService.viewportVectorToCanvasVector(dragVector));
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
      this.arrow.tipPosition = undefined;
      // TODO: If the mouseup was on the trash can, disconnect the arrow from
      // its current card (if it has one).
      this.tipDrag.end();
    }
  }

}
