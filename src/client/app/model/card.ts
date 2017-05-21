import { Point } from './geometry';
import { Arrow } from './arrow';
import { CollaborativeObjectModel } from './collaborative-object-model';

export class Card extends CollaborativeObjectModel {
  protected static modelName = 'Card';
  // Collaborative fields
  position: Point;
  text: string;
  selected: boolean;
  incomingArrow: Arrow;
  outgoingArrow: Arrow;

  static registerModel() {
    super.registerModel();
    this.prototype.position =
      gapi.drive.realtime.custom.collaborativeField('position');
    this.prototype.text =
      gapi.drive.realtime.custom.collaborativeField('text');
    this.prototype.selected =
      gapi.drive.realtime.custom.collaborativeField('selected');
    this.prototype.incomingArrow =
      gapi.drive.realtime.custom.collaborativeField('incomingArrow');
    this.prototype.outgoingArrow =
      gapi.drive.realtime.custom.collaborativeField('outgoingArrow');
  }
};
