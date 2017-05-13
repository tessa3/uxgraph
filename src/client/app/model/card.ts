import { Point } from './geometry';
import { Arrow } from './arrow';
import { UUID } from 'angular2-uuid';

export class Card {
  _id: string;
  position: Point;
  text: string;
  selected: boolean;
  incomingArrow: Arrow;
  outgoingArrow: Arrow;

  // Set getter for id but no setter to prevent overwriting.
  get id() {
    return this._id;
  }

  // Called once when the model is first created.
  initializeModel() {
    this._id = UUID.UUID(); //UUID4 (randomized)
  }

  static registerModel() {
    gapi.drive.realtime.custom.registerType(Card, 'Card');
    gapi.drive.realtime.custom.setInitializer(Card, Card.prototype.initializeModel);
    Card.prototype._id =
      gapi.drive.realtime.custom.collaborativeField('_id');
    Card.prototype.position =
      gapi.drive.realtime.custom.collaborativeField('position');
    Card.prototype.text =
      gapi.drive.realtime.custom.collaborativeField('text');
    Card.prototype.selected =
      gapi.drive.realtime.custom.collaborativeField('selected');
    Card.prototype.incomingArrow =
      gapi.drive.realtime.custom.collaborativeField('incomingArrow');
    Card.prototype.outgoingArrow =
      gapi.drive.realtime.custom.collaborativeField('outgoingArrow');
  }
};
