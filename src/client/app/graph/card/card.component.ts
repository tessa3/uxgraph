import {
  Component, Input, OnInit, HostListener
} from '@angular/core';
import { CanvasService, ViewportCoord, Point, Size } from '../canvas/canvas.service';
import './card';
import {EventUtils} from '../../utils/event-utils';

/**
 * This class represents the Card component.
 */
@Component({
  moduleId: module.id,
  selector: '[uxg-card]',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css']
})
export class CardComponent implements OnInit {
  // The card data to render on the canvas.
  @Input() card: Card = null;
  // The current scale factor of the card shape.
  scale: number = 1;
  // The current display position in the viewport's coordinate space.
  position: ViewportCoord = {x:0, y:0};
  // The size of the card in the canvas' coordinate space.
  size: Size = {width:60, height:80};
  // The radius of the rounded corners in the canvas' coordinate space.
  cornerRadius: number = 5;
  // Whether or not dragging is in progress.
  private dragging: boolean = false;
  // The last point seen during the drag that is currently in progress.
  private lastDragPnt: Point = null; //TODO(eyuelt): make this nullable after TS2 update

  constructor(private canvasService: CanvasService) {
  }

  ngOnInit() {
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);
    this.canvasService.addListener(this.update.bind(this));
  }

  // Called by the CanvasService when a zoom or pan occurs
  update() {
    this.scale = this.canvasService.zoomScale;
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);
  }

  onMousedown(event: MouseEvent) {
    if (EventUtils.eventIsFromPrimaryButton(event)) {
      this.dragging = true;
      const canvasBounds = this.canvasService.getCanvasBounds();
      this.lastDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      if (!this.canvasService.multiSelectMode) {
        this.canvasService.deselectCards();
      }
      this.card.selected = !this.card.selected;
    }
  }

  // Put mousemove on document to allow dragging outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.dragging) {
      event.preventDefault();
      const canvasBounds = this.canvasService.getCanvasBounds();
      const newDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      this.position.x += newDragPnt.x - this.lastDragPnt.x;
      this.position.y += newDragPnt.y - this.lastDragPnt.y;
      const newCardPosition =
        this.canvasService.viewportCoordToCanvasCoord(this.position);
      this.card.x = newCardPosition.x;
      this.card.y = newCardPosition.y;
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

}
