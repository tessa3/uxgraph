import { Point } from './geometry';
import { Card } from './card';
import { CollaborativeObjectModel } from './collaborative-object-model';
import { ArrowElementModel } from '../canvas/canvas-element.service';

export class Arrow extends CollaborativeObjectModel implements ArrowElementModel {
  protected static modelName = 'Arrow';
  // Collaborative fields
  // TODO(eyuelt): get rid of non-null assertions
  tailPosition!: Point;
  tipPosition!: Point;
  fromCard: Card|undefined;
  toCard: Card|undefined;

  // @override
  static registerModel() {
    super.registerModel();
    this.prototype.tailPosition =
      gapi.drive.realtime.custom.collaborativeField('tailPosition');
    this.prototype.tipPosition =
      gapi.drive.realtime.custom.collaborativeField('tipPosition');
    this.prototype.fromCard =
      gapi.drive.realtime.custom.collaborativeField('fromCard');
    this.prototype.toCard =
      gapi.drive.realtime.custom.collaborativeField('toCard');
  }

}
