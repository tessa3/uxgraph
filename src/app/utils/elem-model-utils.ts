// Util functions for messing with the element models

import { CardElementModel, ArrowElementModel } from '../canvas/canvas-element.service';
import { CanvasCoord } from '../canvas/utils/coord';

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

  // The point that the incoming arrows for the card should point to.
  static incomingArrowPoint(card: CardElementModel): CanvasCoord {
    return new CanvasCoord(card.position.x,
                           card.position.y + (card.size.height / 2));
  }

  // The point that the outgoing arrows for the card should point from.
  static outgoingArrowPoint(card: CardElementModel): CanvasCoord {
    return new CanvasCoord(
      card.position.x + card.size.width,
      card.position.y + (card.size.height / 2));
  }

}
