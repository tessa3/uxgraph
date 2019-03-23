import { Point, Size } from './geometry';
import { Arrow } from './arrow';
import { CollaborativeObjectModel } from './collaborative-object-model';
import { CardElementModel } from '../canvas/canvas-element.service';

export class Card extends CollaborativeObjectModel implements CardElementModel {
  protected static modelName = 'Card';
  readonly size: Size = {
    width: 120,
    height: 160
  };
  // Collaborative fields
  // TODO(eyuelt): get rid of non-null assertions
  position!: Point;
  text!: string;
  selected!: boolean;
  incomingArrows!: Arrow[];
  outgoingArrows!: Arrow[];

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

  initializeModel() {
    super.initializeModel();
    const model = gapi.drive.realtime.custom.getModel(this);
    this.incomingArrows = [];
    this.outgoingArrows = [];
  }
}
