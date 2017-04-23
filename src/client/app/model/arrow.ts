import { Point } from './geometry';
import { Card } from './card';

export class Arrow {
  tailPosition: Point;
  tipPosition: Point;
  fromCard: Card;
  toCard: Card;

  static registerModel() {
    gapi.drive.realtime.custom.registerType(Arrow, 'Arrow');
    Arrow.prototype.tailPosition =
      gapi.drive.realtime.custom.collaborativeField('tailPosition');
    Arrow.prototype.tipPosition =
      gapi.drive.realtime.custom.collaborativeField('tipPosition');
    Arrow.prototype.fromCard =
      gapi.drive.realtime.custom.collaborativeField('fromCard');
    Arrow.prototype.toCard =
      gapi.drive.realtime.custom.collaborativeField('toCard');
  }
};
