import { Point } from './geometry';
import { CollaborativeObjectModel } from './collaborative-object-model';

export class Arrow extends CollaborativeObjectModel {
  protected static modelName = 'Arrow';
  // Collaborative fields
  tailPosition: Point;
  tipPosition: Point;
  fromCardId: string;
  toCardId: string;

  static registerModel() {
    super.registerModel();
    this.prototype.tailPosition =
      gapi.drive.realtime.custom.collaborativeField('tailPosition');
    this.prototype.tipPosition =
      gapi.drive.realtime.custom.collaborativeField('tipPosition');
    this.prototype.fromCardId =
      gapi.drive.realtime.custom.collaborativeField('fromCardId');
    this.prototype.toCardId =
      gapi.drive.realtime.custom.collaborativeField('toCardId');
  }
};
