import { Component, Input, OnInit } from '@angular/core';
import { CanvasService, ViewportCoord } from '../canvas/canvas.service';
import './card';

/**
 * This class represents the Card component.
 */
@Component({
  moduleId: module.id,
  selector: '[card]',
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

  constructor(public canvasService: CanvasService) {
  }

  ngOnInit() {
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);
    this.canvasService.addListener(this.update.bind(this));
  }

  // Called by the CanvasService when a zoom or pan occurs
  update() {
    this.scale = this.canvasService.zoomScale;
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card);
  };
}
