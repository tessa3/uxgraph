import { Injectable } from '@angular/core';
import '../../shared/card/card';

@Injectable()
export class CanvasService {
  cards: [Card] = [];
  constructor() {
    this.cards.push(new Card(20, 20, 20));
    this.cards.push(new Card(60, 60, 20));
  }
  getCard(id: number) {
    return this.cards[id];
  }
}
