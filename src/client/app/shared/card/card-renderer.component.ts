import { Component, Input, ElementRef } from '@angular/core';
import './Card';

/**
 * This class represents the CardRenderer component.
 */
@Component({
  moduleId: module.id,
  selector: '[card-renderer]',
  templateUrl: 'card-renderer.component.html',
  styleUrls: ['card-renderer.component.css']
})
export class CardRendererComponent {
  // The card data to render on the canvas.
  @Input() card: Card = null;
  // The attributes passed to Snap for drawing the card shape.
  const drawingAttrs = { fill: "#fd6", stroke: "#000", strokeWidth: 1 };
  // The Snap element for rendering the card.
  snapElement = null;
  // The display offset. This changes as the map is panned around. Origin is top left.
  displayOffset: Object = {x:0, y:0};
  // The current scale factor of the card shape.
  scale: number = 1;
  // A reference to the Snap object wrapping this component's dom element.
  snapWrap = null;

  // TODO(eyuelt): remove ElementRef once Snap is removed
  constructor(domElemRef: ElementRef) {
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
    this.snapElement = this.snapWrap.circle(0, 0, this.card.radius)
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
