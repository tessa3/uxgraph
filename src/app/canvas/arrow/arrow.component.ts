import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CanvasInteractionService } from '../canvas-interaction.service';
import { EventUtils } from '../../utils/event-utils';
import { CanvasElementService, ArrowElementModel } from '../canvas-element.service';
import { ViewportDrag } from '../utils/viewport-drag';
import { ViewportCoord, CanvasCoord } from '../utils/coord';

/**
 * This class represents the Arrow component.
 */
@Component({
  selector: '[uxg-arrow]',  // tslint:disable-line:component-selector
  templateUrl: 'arrow.component.html',
  styleUrls: ['arrow.component.css']
})
export class ArrowComponent implements OnInit {
  // The arrow data to render on the canvas.
  @Input() arrow!: ArrowElementModel;
  // A function pointer to the CanvasInteractionService's "getBounds()" function.
  @Input() canvasBoundsGetter!: (() => ClientRect);

  // The current scale factor of the arrow shape.
  scale = 1;
  // The list of anchor points for the arrow's polyline.
  anchorPoints: ViewportCoord[] = [];
  // The current display position of the tip of the arrow. This is the same as
  // the last point in anchorPoints, so this property is just for convenience.
  tipPosition = new ViewportCoord(0, 0);

  // Represents the drag action on the tip of the arrow.
  private tipDrag: ViewportDrag = new ViewportDrag();

  constructor(private canvasElementService: CanvasElementService,
              private canvasInteractionService: CanvasInteractionService) {
  }

  ngOnInit() {
    this.update();
    this.canvasInteractionService.addListener(this.update.bind(this));
    // TODO(eyuelt): why isn't change detection automatically handling this?
    this.canvasElementService.addListener(this.update.bind(this));
  }

  // Called by the CanvasInteractionService when a zoom or pan occurs or when the
  // CanvasInteractionService is told that the elements data may have been changed.
  update() {
    this.scale = this.canvasInteractionService.zoomScale;
    this.tipPosition = this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.arrow.tipPosition.x, this.arrow.tipPosition.y));
    this.anchorPoints = this.getAnchorPoints();
  }

  // Get the anchor points of the arrow based on the tailPosition and tipPosition
  getAnchorPoints() {
    // TODO(eyuelt): clean this up
    const anchorPoints: ViewportCoord[] = [];
    anchorPoints.push(this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.arrow.tailPosition.x, this.arrow.tailPosition.y)));
    const foo1 = new CanvasCoord(this.arrow.tailPosition.x, this.arrow.tailPosition.y);
    foo1.x += 10;
    anchorPoints.push(this.canvasInteractionService.canvasCoordToViewportCoord(foo1));
    const foo2 = new CanvasCoord(this.arrow.tipPosition.x, this.arrow.tipPosition.y);
    foo2.x -= 20;
    anchorPoints.push(this.canvasInteractionService.canvasCoordToViewportCoord(foo2));
    anchorPoints.push(this.canvasInteractionService.canvasCoordToViewportCoord(
      new CanvasCoord(this.arrow.tipPosition.x, this.arrow.tipPosition.y)));
    return anchorPoints;
  }

  // Convert the tail/tip points to the string format expected by SVG polyline.
  // TODO: change this to a property that gets updated whenever the tail/tip change.
  // otherwise, this function will get called every time the change detector runs
  pointsString() {
    let pointsStr = '';
    for (const point of this.anchorPoints) {
      pointsStr += `${point.x},${point.y} `;
    }
    return pointsStr;
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
      this.tipPosition = this.tipPosition.translated(dragVector);
      const newTipPosition =
        this.canvasInteractionService.viewportCoordToCanvasCoord(this.tipPosition);
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
      this.tipDrag.end();
    }
  }

}
