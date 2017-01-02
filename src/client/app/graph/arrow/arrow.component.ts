import { Component, Input, OnInit } from '@angular/core';
import { CanvasService, ViewportCoord } from '../canvas/canvas.service';
import {
  GoogleRealtimeService,
  OBJECT_CHANGED
} from '../../service/google-realtime.service';

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
  @Input() arrow: any = null; // TODO(eyuelt): type should be Arrow
  // The current scale factor of the arrow shape.
  scale: number = 1;
  // The list of anchor points for the arrow's polyline.
  anchorPoints: ViewportCoord[] = [];
  // The current display position of the tip of the arrow. This is the same as
  // the last point in anchorPoints, so this property is just for convenience.
  tipPosition: ViewportCoord = {x:0, y:0};
  // The model of the card that the tail of the arrow is attached to.
  private fromCard: any = null; // TODO(eyuelt): type should be Card
  // The model of the card that the tip of the arrow is attached to.
  private toCard: any = null; // TODO(eyuelt): type should be Card

  constructor(private canvasService: CanvasService,
              private googleRealtimeService: GoogleRealtimeService) {
  }

  ngOnInit() {
    this.fromCard = this.canvasService.cards.get(this.arrow.fromCardId);
    this.toCard = this.canvasService.cards.get(this.arrow.toCardId);
    this.update();
    this.canvasService.addListener(this.update.bind(this));
    this.googleRealtimeService.currentDocument.subscribe(document => {
      // TODO(eyuelt): change this. this causes a redraw whenever any object in
      // the whole document changes.
      document.getModel().getRoot()
          .addEventListener(OBJECT_CHANGED, this.update.bind(this));
    });
  }

  // Called by the CanvasService when a zoom or pan occurs
  update() {
    this.scale = this.canvasService.zoomScale;

    // TODO: don't hard code card sizes here
    let fromCardPoint = {x: this.fromCard.x + 60, y: this.fromCard.y + 40};
    this.arrow.tailPosition = fromCardPoint;
    let toCardPoint = {x: this.toCard.x, y: this.toCard.y + 40};
    this.arrow.tipPosition = toCardPoint;

    this.tipPosition = this.canvasService.canvasCoordToViewportCoord(this.arrow.tipPosition);
    this.anchorPoints = this.getAnchorPoints();
  }

  // Get the anchor points of the arrow based on the tailPosition and tipPosition
  getAnchorPoints() {
    // TODO(eyuelt): clean this up
    let anchorPoints: ViewportCoord[] = [];
    anchorPoints.push(this.canvasService.canvasCoordToViewportCoord(this.arrow.tailPosition));
    const foo1 = {x:this.arrow.tailPosition.x, y:this.arrow.tailPosition.y};
    foo1.x += 10;
    anchorPoints.push(this.canvasService.canvasCoordToViewportCoord(foo1));
    const foo2 = {x:this.arrow.tipPosition.x, y:this.arrow.tipPosition.y};
    foo2.x -= 20;
    anchorPoints.push(this.canvasService.canvasCoordToViewportCoord(foo2));
    anchorPoints.push(this.canvasService.canvasCoordToViewportCoord(this.arrow.tipPosition));
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

}
