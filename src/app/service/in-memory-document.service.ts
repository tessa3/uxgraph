import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Collaborator } from '../model/collaborator';
import { DocumentService, DocumentModel } from './document.service';
import { Card, Point, Arrow } from '../model';

// TODO
export class InMemoryDocumentModel {
  cards: Card[] = [];
  arrows: Arrow[] = [];

  constructor(public id: string) {}
  addCard(card: Card) { this.cards.push(card); }
  addArrow(arrow: Arrow) { this.arrows.push(arrow); }
}

@Injectable()
export class InMemoryDocumentService extends DocumentService {

  models: InMemoryDocumentModel[] = [];

  currentModelObs = new BehaviorSubject<InMemoryDocumentModel|null>(null);

  constructor() {
    super();
  }

  private getOrCreateDocumentModelById(id: string): InMemoryDocumentModel {
    let model = this.models.find((m) => m.id === id);
    if (!model) {
      model = new InMemoryDocumentModel(id);
      this.models.push(model);
    }
    return model;
  }

  load(documentId: string): void {
    this.currentModelObs.next(this.getOrCreateDocumentModelById(documentId));
  }

  close(): void {
    this.currentModelObs.next(null);
  }

  getCollaborators(): Observable<Collaborator[]> {
    return of([]);
  }

  getModel(): Observable<DocumentModel|null> {
    return this.currentModelObs;
  }


  // @override
  createCard(position: Point = {x: 0, y: 0},
             text: string = '',
             selected = false): Card|null {
    if (!this.currentModelObs.value) { return null; }
    const card = new Card(true);
    card.position = position;
    card.text = text;
    card.selected = selected;
    this.currentModelObs.value.addCard(card);
    return card;
  }

  // @override
  createArrow(tailPosition: Point = {x: 0, y: 0},
              tipPosition: Point = {x: 0, y: 0}): Arrow|null {
    if (!this.currentModelObs.value) { return null; }
    const arrow = new Arrow(true);
    arrow.tailPosition = tailPosition;
    arrow.tipPosition = tipPosition;
    this.currentModelObs.value.addArrow(arrow);
    return arrow;
  }

}
