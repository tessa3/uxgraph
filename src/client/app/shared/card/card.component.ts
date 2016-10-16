import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { CanvasService } from '../canvas/canvas.service';
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
  // The attributes passed to Snap for drawing the card shape.
  drawingAttrs = { fill: '#fd6', stroke: '#000', strokeWidth: 1 };
  // The Snap element for rendering the card.
  snapElement = null;
  // The display offset. This changes as the map is panned around. Origin is top left.
  displayOffset = {x:0, y:0}; // TODO(eyuelt): define a Point interface
  // The current scale factor of the card shape.
  scale: number = 1;
  // A reference to the Snap object wrapping this component's dom element.
  snapWrap = null;

  // TODO(eyuelt): remove ElementRef once Snap is removed
  constructor(domElemRef: ElementRef, public canvasService: CanvasService) {
    this.snapWrap = Snap(domElemRef.nativeElement);
  }

  ngOnInit() {
    this.initSnapElement();
    this.performTransformations();
  }

  // Create and init the Snap.svg element that is used for rendering the card.
  initSnapElement() {
    // Set the initial (x,y) to the origin to avoid having to account for the
    // initial (x,y) when doing transforms.
    this.snapElement = this.snapWrap.circle(0, 0, this.card.radius);
    this.snapElement.attr(this.drawingAttrs);

    // Don't scale the border when zooming.
    var att = document.createAttribute('vector-effect');
    att.value = 'non-scaling-stroke';
    this.snapElement.node.setAttributeNode(att);
  }

  // Translate and scale the rendered card as required.
  performTransformations() {
    const xPos = this.card.x + this.displayOffset.x;
    const yPos = this.card.y + this.displayOffset.y;
    const translateStr = `translate(${xPos},${yPos})`;
    const scaleStr = `scale(${this.scale})`;
    const transformStr = `${translateStr} ${scaleStr}`;
    this.snapElement.transform(transformStr);
  }
}
