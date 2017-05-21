import { Point, Size } from './geometry';
import { Arrow } from './arrow';
import { CollaborativeObjectModel } from './collaborative-object-model';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;

export class Card extends CollaborativeObjectModel {
  protected static modelName = 'Card';
  readonly size: Size = {width:120, height:160};
  // Collaborative fields
  position: Point;
  text: string;
  selected: boolean;
  // TODO(eyuelt): Change these to normal arrays since CollaborativeLists
  // inside custom collaborative objects are not actually collaborative.
  incomingArrows: CollaborativeList<Arrow>;
  outgoingArrows: CollaborativeList<Arrow>;

  initializeModel() {
    super.initializeModel();
    const model = gapi.drive.realtime.custom.getModel(this);
    this.incomingArrows = model.createList() as CollaborativeList<Arrow>;
    this.outgoingArrows = model.createList() as CollaborativeList<Arrow>;
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
