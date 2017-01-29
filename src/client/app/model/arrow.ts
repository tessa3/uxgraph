import { CanvasCoord } from '../graph/canvas/canvas.service';

export class Arrow {
  tailPosition: CanvasCoord;
  tipPosition: CanvasCoord;
  fromCardId: string;
  toCardId: string;

  static registerModel() {
    gapi.drive.realtime.custom.registerType(Arrow, 'Arrow');
    Arrow.prototype.tailPosition =
      gapi.drive.realtime.custom.collaborativeField('tailPosition');
    Arrow.prototype.tipPosition =
      gapi.drive.realtime.custom.collaborativeField('tipPosition');
    Arrow.prototype.fromCardId =
      gapi.drive.realtime.custom.collaborativeField('fromCardId');
    Arrow.prototype.toCardId =
      gapi.drive.realtime.custom.collaborativeField('toCardId');
  }
};
