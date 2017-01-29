import { Arrow } from './arrow';

export class Card {
  x: number;
  y: number;
  text: string;
  selected: boolean;
  incomingArrow: Arrow;
  outgoingArrow: Arrow;

  static registerModel() {
    gapi.drive.realtime.custom.registerType(Card, 'Card');
    Card.prototype.x =
      gapi.drive.realtime.custom.collaborativeField('x');
    Card.prototype.y =
      gapi.drive.realtime.custom.collaborativeField('y');
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
