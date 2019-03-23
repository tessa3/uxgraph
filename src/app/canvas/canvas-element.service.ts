import {Injectable} from '@angular/core';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import { Point, Size } from '../model/geometry';

// Specifies the type of connection an arrow has to a card. Note that an arrow
// may be connected to up to two cards, so it could have an INCOMING connection
// and an OUTGOING connection.
export enum ArrowConnectionType {
  INCOMING,
  OUTGOING
}

export interface CardElementModel {
  id: string;
  size: Size;
  position: Point;
  text: string;
  selected: boolean;
  incomingArrows: CollaborativeList<ArrowElementModel>;  // TODO: change to list
  outgoingArrows: CollaborativeList<ArrowElementModel>;  // TODO: change to list
}

export interface ArrowElementModel {
  id: string;
  tailPosition: Point;
  tipPosition: Point;
  fromCard: CardElementModel;
  toCard: CardElementModel;
}

@Injectable()
// This class is responsible for getting the data for the canvas.
export abstract class CanvasElementService {
  // The models of the cards to show on the canvas.
  cards: CardElementModel[] = [];
  // The models of the arrows to show on the canvas.
  arrows: ArrowElementModel[] = [];

  // TODO(eyuelt): delete this once I've figured out why change detection isn't
  // working for canvas elements.
  private listeners: (() => void)[] = [];

  constructor() {}

  // Creates a card and adds it to the canvas.
  abstract addCard(
    position?: Point, text?: string, selected?: boolean): CardElementModel|null;

  // Creates an arrow and adds it to the canvas.
  abstract addArrow(tailPosition?: Point, tipPosition?: Point): ArrowElementModel|null;

  connectArrowAndCard(arrow: ArrowElementModel, card: CardElementModel,
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

  getCardById(id: string): CardElementModel|null {
    // TODO(eyuelt): change list of cards to map
    for (const card of this.cards) {
      if (card.id === id) {
        return card;
      }
    }
    return null;
  }

  // Repositions the given arrow's tail and tip based on its attached cards.
  repositionArrow(arrow: ArrowElementModel) {
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
  arrowTipDroppedOnCard(arrow: ArrowElementModel, cardId: string) {
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
    for (const card of this.cards) {
      card.selected = false;
    }
  }

  // TODO(eyuelt): move this somewhere else
  // This function treats all of the operations in the given fn as a transaction.
  // Currently only useful if we're using Google Realtime.
  transaction(fn: () => void) {
    fn();
  }

  // TODO(eyuelt): Get rid of this listener stuff.
  addListener(listener: () => void) {
    this.listeners.push(listener);
  }
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

}
