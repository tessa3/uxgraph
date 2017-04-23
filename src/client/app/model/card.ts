import { Point } from './geometry';
import { Arrow } from './arrow';

export class Card {
  position: Point;
  text: string;
  selected: boolean;
  incomingArrows: gapi.drive.realtime.CollaborativeList<Arrow>;
  outgoingArrows: gapi.drive.realtime.CollaborativeList<Arrow>;

  // Called once when the model is first created.
  initializeModel() {
    var model = gapi.drive.realtime.custom.getModel(this);
    this.incomingArrows = model.createList();
    this.outgoingArrows = model.createList();
  }

  static registerModel() {
    gapi.drive.realtime.custom.registerType(Card, 'Card');
    gapi.drive.realtime.custom.setInitializer(Card, Card.prototype.initializeModel);
    Card.prototype.position =
      gapi.drive.realtime.custom.collaborativeField('position');
    Card.prototype.text =
      gapi.drive.realtime.custom.collaborativeField('text');
    Card.prototype.selected =
      gapi.drive.realtime.custom.collaborativeField('selected');
    Card.prototype.incomingArrows =
      gapi.drive.realtime.custom.collaborativeField('incomingArrows');
    Card.prototype.outgoingArrows =
      gapi.drive.realtime.custom.collaborativeField('outgoingArrows');
  }
};
