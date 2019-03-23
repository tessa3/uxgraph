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

// TODO(eyuelt): split this into two classes. one that is responsible for
// messing with other canvas elements. one that provides the methods that
// need to be overridden for each backend type. e.g. deselectCards doesn't
// depend on the backend type, but a card will need to call it in order to
// affect the other cards on the canvas.

@Injectable({
  providedIn: 'root'
})
// This class is responsible for getting the data for the canvas.
export class CanvasElementManagerService {
  // The models of the cards to show on the canvas.
  cards: CollaborativeList<Card>|undefined;
  // The models of the arrows to show on the canvas.
  arrows: CollaborativeList<Arrow>|undefined;

  // TODO(eyuelt): delete this once I've figured out why change detection isn't
  // working for canvas elements.
  private listeners: (() => void)[] = [];

  // A reference to the Realtime Document. Used here to create Cards and Arrows.
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

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

      this.notifyListeners();

      // If anything in the document changes, update all of the canvas elements.
      // TODO(eyuelt): only update the specific canvas elements that changed.
      currentDocument.getModel().getRoot()
        .addEventListener(OBJECT_CHANGED, this.notifyListeners.bind(this));
    });
  }

  //getCards(): Card[] {
  //  return this.cards!.asArray();
  //}

  //getArrows(): Arrow[] {
  //  return this.arrows!.asArray();
  //}

  // Creates a card and adds it to the canvas.
  addCard(position: Point = {x: 0, y: 0},
          text: string = '',
          selected = false): Card|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model && this.cards) {
        const card = model.create(Card);
        card.position = position;
        card.text = text;
        card.selected = selected;
        this.cards.push(card);
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
      if (model && this.arrows) {
        const arrow = model.create(Arrow);
        arrow.tailPosition = tailPosition;
        arrow.tipPosition = tipPosition;
        this.arrows.push(arrow);
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

  getCardById(id: string): Card|null {
    // TODO(eyuelt): change CollaborativeList to CollaborativeMap
    if (this.cards) {
      for (const card of this.cards.asArray()) {
        if (card.id === id) {
          return card;
        }
      }
    }
    return null;
  }

  // Repositions the given arrow's tail and tip based on its attached cards.
  repositionArrow(arrow: Arrow) {
    if (!arrow.fromCard && !arrow.toCard) {
      return;
    }
    if (arrow.toCard) {
      arrow.tipPosition = {
        x: arrow.toCard.position.x,
        y: arrow.toCard.position.y + arrow.toCard.size.height / 2
      };
      if (arrow.fromCard === null) {
        arrow.tailPosition = {
          x: arrow.toCard.position.x - 50,
          y: arrow.toCard.position.y + arrow.toCard.size.height / 2
        };
      }
    }
    if (arrow.fromCard) {
      arrow.tailPosition = {
        x: arrow.fromCard.position.x + arrow.fromCard.size.width,
        y: arrow.fromCard.position.y + arrow.fromCard.size.height / 2
      };
      if (arrow.toCard === null) {
        arrow.tipPosition = {
          x: arrow.fromCard.position.x + arrow.fromCard.size.width + 50,
          y: arrow.fromCard.position.y + arrow.fromCard.size.height / 2
        };
      }
    }
  }

  // connects the arrow to the card and repositions it
  arrowTipDroppedOnCard(arrow: Arrow, cardId: string) {
    if (cardId !== null) {
      console.log('clicked on card id: ' + cardId);
      const card = this.getCardById(cardId);
      if (card !== null) {
        this.connectArrowAndCard(arrow, card, ArrowConnectionType.INCOMING);
        this.repositionArrow(arrow);
      }
    }
  }

  deselectCards() {
    if (this.cards) {
      for (const card of this.cards.asArray()) {
        card.selected = false;
      }
    }
  }

  // TODO(eyuelt): Get rid of this listener stuff.
  addListener(listener: () => void) {
    this.listeners.push(listener);
  }
  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

}