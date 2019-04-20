// Util functions for messing with the element models

import { CardElementModel, ArrowElementModel } from '../canvas/canvas-element.service';

// Specifies the type of connection an arrow has to a card. Note that an arrow
// may be connected to up to two cards, so it could have an INCOMING connection
// and an OUTGOING connection.
export enum ArrowConnectionType {
  INCOMING,
  OUTGOING
}

export class ElemModelUtils {

  // TODO(eyuelt): This is for backwards compatability with the existing
  // GoogleRealtime uxgraphs. I'll delete this eventually. It's required
  // because I changed the type of the arrow lists on Card from
  // CollaborativeLists to regular arrays.
  static backwardsCompatibleArrows(arrows: ArrowElementModel[]): ArrowElementModel[] {
    if ((arrows as any).asArray) {
      arrows = (arrows as any).asArray();
    }
    return arrows;
  }

  // Find the arrow with the given id in the array and delete it.
  private static removeArrowById(arrows: ArrowElementModel[], id: string) {
    arrows = this.backwardsCompatibleArrows(arrows);
    const index = arrows.findIndex((arrow) => {
      return arrow.id === id;
    });
    arrows.splice(index, 1);
  }

  // Connect the given arrow to the given card with the given connection type.
  static connectArrowAndCard(arrow: ArrowElementModel, card: CardElementModel,
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



  // TODO: delete this
  static adjustConnectedArrows(card: CardElementModel) {
    const incomingArrows: ArrowElementModel[] =
        this.backwardsCompatibleArrows(card.incomingArrows);
    const outgoingArrows: ArrowElementModel[] =
       this.backwardsCompatibleArrows(card.outgoingArrows);
    // TODO(eyuelt): instead, have arrows subscribe to card position changes
    incomingArrows.forEach((arrow: ArrowElementModel) => { this.repositionArrow(arrow); });
    outgoingArrows.forEach((arrow: ArrowElementModel) => { this.repositionArrow(arrow); });
  }

  // TODO: delete this
  // Repositions the given arrow's tail and tip based on its attached cards.
  static repositionArrow(arrow: ArrowElementModel) {
    if (!arrow.fromCard && !arrow.toCard) {
      return;
    }
    if (arrow.toCard) {
      arrow.tipPosition = {
        x: arrow.toCard.position.x,
        y: arrow.toCard.position.y + arrow.toCard.size.height / 2
      };
      if (arrow.fromCard == null) {
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
      if (arrow.toCard == null) {
        arrow.tipPosition = {
          x: arrow.fromCard.position.x + arrow.fromCard.size.width + 50,
          y: arrow.fromCard.position.y + arrow.fromCard.size.height / 2
        };
      }
    }
  }

}
