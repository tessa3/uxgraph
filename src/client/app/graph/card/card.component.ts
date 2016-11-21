import {
  Component, Input, OnInit, HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CanvasService, ViewportCoord, Point } from '../canvas/canvas.service';
import './card';

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
  // Whether or not dragging is in progress.
  dragging: boolean = false;
  // The last point seen during the drag that is currently in progress.
  lastDragPnt: Point = null; //TODO(eyuelt): make this nullable after TS2 update

  constructor(private canvasService: CanvasService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);
    this.canvasService.addListener(this.update.bind(this));
  }

  // Called by the CanvasService when a zoom or pan occurs
  update() {
    this.scale = this.canvasService.zoomScale;
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);

    // TODO(girum): Updating libraries caused our SVG panning to break without
    // calling the CD manually. Fix this!
    this.changeDetector.detectChanges();
  }

  onMousedown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.dragging = true;
    const canvasBounds = this.canvasService.getCanvasBounds();
    this.lastDragPnt = {
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top
    };
  }

  // Put mousemove on document to allow dragging outside of canvas
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.dragging) {
      event.stopPropagation();
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

      // TODO(girum): Updating libraries caused our SVG panning to break without
      // calling the CD manually. Fix this!
      this.changeDetector.detectChanges();
    }
  }

  // Put mouseup on document to end drag even if mouseup is outside of canvas
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.dragging) {
      event.stopPropagation();
      event.preventDefault();
      this.dragging = false;
      this.lastDragPnt = null;
    }
  }

}
