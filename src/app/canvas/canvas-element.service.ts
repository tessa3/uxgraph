import { Injectable } from '@angular/core';
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
  incomingArrows: ArrowElementModel[];
  outgoingArrows: ArrowElementModel[];
}

export interface ArrowElementModel {
  id: string;
  tailPosition: Point;
  tipPosition: Point;
  fromCard: CardElementModel|undefined;
  toCard: CardElementModel|undefined;
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

  // TODO(eyuelt): This is for backwards compatability with the existing
  // GoogleRealtime uxgraphs. I'll delete this eventually. It's required
  // because I changed the type of the arrow lists on Card from
  // CollaborativeLists to regular arrays.
  private backwardsCompatibleArrows(arrows: ArrowElementModel[]): ArrowElementModel[] {
    if ((arrows as any).asArray) {
      arrows = (arrows as any).asArray();
    }
    return arrows;
  }

  // Find the arrow with the given id in the array and delete it.
  private removeArrowById(arrows: ArrowElementModel[], id: string) {
    arrows = this.backwardsCompatibleArrows(arrows);
    const index = arrows.findIndex((arrow) => {
      return arrow.id === id;
    });
    arrows.splice(index, 1);
  }

  connectArrowAndCard(arrow: ArrowElementModel, card: CardElementModel,
                      arrowConnection: ArrowConnectionType) {
    if (arrowConnection === ArrowConnectionType.INCOMING) {
      if (arrow.toCard) {
        this.removeArrowById(arrow.toCard.incomingArrows, arrow.id);
      }
      arrow.toCard = card;
      card.incomingArrows.push(arrow);
    } else if (arrowConnection === ArrowConnectionType.OUTGOING) {
      if (arrow.fromCard) {
        this.removeArrowById(arrow.fromCard.outgoingArrows, arrow.id);
      }
      arrow.fromCard = card;
      card.outgoingArrows.push(arrow);
    }
  }

  adjustConnectedArrows(card: CardElementModel) {
    const incomingArrows: ArrowElementModel[] = this.backwardsCompatibleArrows(card.incomingArrows);
    const outgoingArrows: ArrowElementModel[] = this.backwardsCompatibleArrows(card.outgoingArrows);
    // TODO(eyuelt): instead, have arrows subscribe to card position changes
    incomingArrows.forEach((arrow: ArrowElementModel) => {
      this.repositionArrow(arrow);
    });
    outgoingArrows.forEach((arrow: ArrowElementModel) => {
      this.repositionArrow(arrow);
    });
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
