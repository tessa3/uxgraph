import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import CollaborativeMap = gapi.drive.realtime.CollaborativeMap;
import {Card} from './card';


export class CardList implements Iterable<Card> {
  cards: CollaborativeList<CollaborativeMap<any>>;

  constructor(rawCards: CollaborativeList<CollaborativeMap<any>>) {
    this.cards = rawCards;
  }

  [Symbol.iterator](): Iterator<Card> {
    let nextIndex = 0;
    let cards = this.cards;

    return {
      next(): IteratorResult<Card> {
        if (nextIndex >= cards.length) {
          return {done: true};
        }

        nextIndex++;
        let rawCard = cards.get(nextIndex);
        let card = new Card(rawCard);

        return {value: card, done: false};
      }
    };
  }

}
