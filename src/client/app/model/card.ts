import { Point } from './geometry';
import { Arrow } from './arrow';
import { CollaborativeObjectModel } from './collaborative-object-model';

export class Card extends CollaborativeObjectModel {
  protected static modelName = 'Card';
  // Collaborative fields
  position: Point;
  text: string;
  selected: boolean;
  incomingArrows: gapi.drive.realtime.CollaborativeList<Arrow>;
  outgoingArrows: gapi.drive.realtime.CollaborativeList<Arrow>;

  initializeModel() {
    super.initializeModel();
    var model = gapi.drive.realtime.custom.getModel(this);
    this.incomingArrows = model.createList() as gapi.drive.realtime.CollaborativeList<Arrow>;
    this.outgoingArrows = model.createList() as gapi.drive.realtime.CollaborativeList<Arrow>;
  }

  static registerModel() {
    super.registerModel();
    this.prototype.position =
      gapi.drive.realtime.custom.collaborativeField('position');
    this.prototype.text =
      gapi.drive.realtime.custom.collaborativeField('text');
    this.prototype.selected =
      gapi.drive.realtime.custom.collaborativeField('selected');
    this.prototype.incomingArrows =
      gapi.drive.realtime.custom.collaborativeField('incomingArrows');
    this.prototype.outgoingArrows =
      gapi.drive.realtime.custom.collaborativeField('outgoingArrows');
  }
};
