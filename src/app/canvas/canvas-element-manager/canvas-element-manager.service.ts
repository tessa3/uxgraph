import {Injectable} from '@angular/core';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import { Card } from '../../model/card';
import { Arrow } from '../../model/arrow';
import {
  GoogleRealtimeService,
  OBJECT_CHANGED,
} from 'src/app/service';
import { Point } from '../../model/geometry';

// Specifies the type of connection an arrow has to a card. Note that an arrow
// may be connected to up to two cards, so it could have an INCOMING connection
// and an OUTGOING connection.
export enum ArrowConnectionType {
  INCOMING,
  OUTGOING
}

@Injectable({
  providedIn: 'root'
})
// This class is responsible for getting the data for the canvas.
export class CanvasElementManagerService {
  // The models of the cards to show on the canvas.
  cards: CollaborativeList<Card>|undefined;
  // The models of the arrows to show on the canvas.
  arrows: CollaborativeList<Arrow>|undefined;

  // A reference to the Realtime Document. Used here to create Cards and Arrows.
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  private savedListener: (() => void) | undefined;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      this.realtimeDocument = currentDocument;
      if (currentDocument === null) {
        return;
      }

      const model = currentDocument.getModel();

      // Lazily instantiate the collaborative cards array.
      if (model.getRoot().get('cards') === null) {
        console.log('no "cards" object at root');
        const collaborativeCards = model.createList([]);
        model.getRoot().set('cards', collaborativeCards);
      }

      this.cards = model.getRoot().get('cards');

      // Lazily instantiate the collaborative arrows array.
      if (model.getRoot().get('arrows') === null) {
        console.log('no "arrows" object at root');
        const collaborativeArrows = model.createList([]);
        model.getRoot().set('arrows', collaborativeArrows);
      }

      this.arrows = model.getRoot().get('arrows');

      this.letemknow();

      // If anything in the document changes, update all of the canvas elements.
      // TODO(eyuelt): only update the specific canvas elements that changed.
      currentDocument.getModel().getRoot()
        .addEventListener(OBJECT_CHANGED, this.letemknow.bind(this));
    });
  }

  letmeknow(listener: ()=>void) {
    if (this.cards) {
      let str = ''
      this.cards.asArray().forEach((elem) => {
        str += `{x:${Math.ceil(elem.position.x)},y:${Math.ceil(elem.position.y)}}, `;
      });
      console.log('[' + str.slice(0, -2) + ']');
    }
    this.savedListener = listener;
  }
  letemknow() {
    if (this.savedListener) {
      this.savedListener();
    }
  }

  getCards(): Card[] {
    return this.cards!.asArray();
  }

  getArrows(): Arrow[] {
    return this.arrows!.asArray();
  }

  // Creates a card and adds it to the canvas.
  addCard(position: Point = {x: 0, y: 0},
          text: string = '',
          selected = false): Card|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model) {
        const card = model.create(Card);
        card.position = position;
        card.text = text;
        card.selected = selected;
        model.getRoot().get('cards').push(card);  // TODO(eyuelt): shouldn't we be adding directly to this.cards?
        return card;
      }
    }
    return null;
  }

  // Creates an arrow and adds it to the canvas.
  addArrow(tailPosition: Point = {x: 0, y: 0},
           tipPosition: Point = {x: 0, y: 0}): Arrow|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model) {
        const arrow = model.create(Arrow);
        arrow.tailPosition = tailPosition;
        arrow.tipPosition = tipPosition;
        model.getRoot().get('arrows').push(arrow);  // TODO(eyuelt): same as above
        return arrow;
      }
    }
    return null;
  }

  connectArrowAndCard(arrow: Arrow, card: Card,
                      arrowConnection: ArrowConnectionType) {
    if (arrowConnection === ArrowConnectionType.INCOMING) {
      if (arrow.toCard) {
        arrow.toCard.incomingArrows.removeValue(arrow);
      }
      arrow.toCard = card;
      card.incomingArrows.push(arrow);
    } else if (arrowConnection === ArrowConnectionType.OUTGOING) {
      if (arrow.fromCard) {
        arrow.fromCard.outgoingArrows.removeValue(arrow);
      }
      arrow.fromCard = card;
      card.outgoingArrows.push(arrow);
    }
  }

  // This function calls the given function within a Realtime compound
  // operation, which treats the function as a transaction.
  realtimeTransaction(fn: () => void) {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      model.beginCompoundOperation();
      fn();
      model.endCompoundOperation();
    }
  }

}