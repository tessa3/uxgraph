import { Component, Input, OnInit } from '@angular/core';
import { CanvasService, ViewportCoord } from '../canvas/canvas.service';
import './arrow';

/**
 * This class represents the Arrow component.
 */
@Component({
  moduleId: module.id,
  selector: '[uxg-arrow]',
  templateUrl: 'arrow.component.html',
  styleUrls: ['arrow.component.css']
})
export class ArrowComponent implements OnInit {
  // The arrow data to render on the canvas.
  @Input() arrow: Arrow = null;
  // The current scale factor of the arrow shape.
  scale: number = 1;
  // The current display position of the tail in the viewport's coordinate space.
  tailPosition: ViewportCoord = {x:0, y:0};
  // The current display position of the tip in the viewport's coordinate space.
  tipPosition: ViewportCoord = {x:0, y:0};
  // The model of the card that the tail of the arrow is attached to.
  private fromCard: Card = null;
  // The model of the card that the tip of the arrow is attached to.
  private toCard: Card = null;

  constructor(private canvasService: CanvasService) {
  }

  ngOnInit() {
    this.fromCard = this.canvasService.cards[this.arrow.fromCardId];
    this.toCard = this.canvasService.cards[this.arrow.toCardId];
    this.update();
    this.canvasService.addListener(this.update.bind(this));
  }

  // Called by the CanvasService when a zoom or pan occurs
  // TODO: rename to repositionOnCanvas and add it to an interface called CanvasElement
  update() {
    this.scale = this.canvasService.zoomScale;
    // TODO: don't hard code card size here
    let fromCardPoint = {x: this.fromCard.x + 60, y: this.fromCard.y + 40};
    let toCardPoint = {x: this.toCard.x, y: this.toCard.y + 40};
    this.tailPosition = this.canvasService.canvasCoordToViewportCoord(fromCardPoint);
    this.tipPosition = this.canvasService.canvasCoordToViewportCoord(toCardPoint);
  }

  // Convert the tail/tip points to the string format expected by SVG polyline.
  // TODO: change this to a property that gets updated whenever the tail/tip change. that way,
  // when the property changes, change detection is triggered. also this will support >2 points.
  pointsString() {
    const tail = this.tailPosition;
    const tip = this.tipPosition;
    return `${0},${0} ${tip.x - tail.x},${tip.y - tail.y}`;
  }

}
