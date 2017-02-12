import { Point } from './geometry';
import { Arrow } from './arrow';
import CollaborativeMap = gapi.drive.realtime.CollaborativeMap;
import Model = gapi.drive.realtime.Model;
import CollaborativeString = gapi.drive.realtime.CollaborativeString;

// export class OldCard {
//   position: Point;
//   text: string;
//   selected: boolean;
//   incomingArrow: Arrow;
//   outgoingArrow: Arrow;
//
//   static registerModel() {
//     gapi.drive.realtime.custom.registerType(OldCard, 'Card');
//     OldCard.prototype.position =
//       gapi.drive.realtime.custom.collaborativeField('position');
//     OldCard.prototype.text =
//       gapi.drive.realtime.custom.collaborativeField('text');
//     OldCard.prototype.selected =
//       gapi.drive.realtime.custom.collaborativeField('selected');
//     OldCard.prototype.incomingArrow =
//       gapi.drive.realtime.custom.collaborativeField('incomingArrow');
//     OldCard.prototype.outgoingArrow =
//       gapi.drive.realtime.custom.collaborativeField('outgoingArrow');
//   }
// }

export class Card {
  private map: CollaborativeMap<any>;

  static create(model: Model) {
    let card = new Card();
    card.map = model.createMap();
    card.map.set('text', model.createString());
    return card;
  }

  // Internal constructor.
  constructor(existingMap?: CollaborativeMap<any>) {
    this.map = existingMap;
  }

  get position(): Point {
    return this.map.get('position');
  }
  set position(point: Point) {
    this.map.set('position', point);
  }

  get text(): CollaborativeString {
    return this.map.get('text');
  }

  get selected(): boolean {
    return this.map.get('selected');
  }
  set selected(selected: boolean) {
    this.map.set('selected', selected);
  }

  get incomingArrow(): Arrow {
    return this.map.get('incomingArrow');
  }
  set incomingArrow(arrow: Arrow) {
    this.map.set('incomingArrow', arrow);
  }

  get outgoingArrow(): Arrow {
    return this.map.get('outgoingArrow');
  }
  set outgoingArrow(arrow: Arrow) {
    this.map.set('outgoingArrow', arrow);
  }
}
