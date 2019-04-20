import { Injectable } from '@angular/core';
import { Point, Size } from '../model';
import { ElemModelUtils, ArrowConnectionType } from '../utils/elem-model-utils';

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
export class CanvasElementService {
  // The models of the cards to show on the canvas.
  cards: CardElementModel[] = [];
  // The models of the arrows to show on the canvas.
  arrows: ArrowElementModel[] = [];

  constructor() {}

  // Creates a card and adds it to the canvas.
  addCard(card: CardElementModel) {
    this.cards.push(card);
  }

  // Creates an arrow and adds it to the canvas.
  addArrow(arrow: ArrowElementModel) {
    this.arrows.push(arrow);
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

  // connects the arrow to the card and repositions it
  arrowTipDroppedOnCard(arrow: ArrowElementModel, cardId: string) {
    if (cardId !== null) {
      console.log('clicked on card id: ' + cardId);
      const card = this.getCardById(cardId);
      if (card !== null) {
        ElemModelUtils.connectArrowAndCard(arrow, card, ArrowConnectionType.INCOMING);
        ElemModelUtils.repositionArrow(arrow);
      }
    }
  }

  deselectCards() {
    for (const card of this.cards) {
      card.selected = false;
    }
  }

}
