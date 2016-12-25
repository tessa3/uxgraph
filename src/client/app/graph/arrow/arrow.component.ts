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
  @Input() arrow: any = null;
  // The current scale factor of the arrow shape.
  scale: number = 1;
  // The current display position of the tail in the viewport's coordinate
  // space. This will also be used as the origin of the SVG coordinate space.
  tailPosition: ViewportCoord = {x:0, y:0};
  // The current display position of the tip in the viewport's coordinate space.
  tipPosition: ViewportCoord = {x:0, y:0};
  // The model of the card that the tail of the arrow is attached to.
  private fromCard: any = null;
  // The model of the card that the tip of the arrow is attached to.
  private toCard: any = null;

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
  // TODO: change this to a property that gets updated whenever the tail/tip change.
  // otherwise, this function will get called every time the change detector runs
  pointsString() {
    const tail = this.tailPosition;
    const tip = this.tipPosition;
    return `${0},${0} ${tip.x - tail.x},${tip.y - tail.y}`;
  }

}
