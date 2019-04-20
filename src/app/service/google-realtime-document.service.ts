import { Injectable } from '@angular/core';
import { GoogleRealtimeService } from './google-realtime.service';
import { DocumentService, DocumentModel } from './document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Collaborator } from '../model/collaborator';
import { Point, Card, Arrow } from '../model';

@Injectable()
export class GoogleRealtimeDocumentService extends DocumentService {

  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    super();
  }

  // @override
  load(documentId: string) {
    this.googleRealtimeService.loadRealtimeDocument(documentId);
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      this.realtimeDocument = currentDocument;
      if (currentDocument === null) { return; }

      const model = currentDocument.getModel();
      // Lazily instantiate the collaborative cards array.
      if (model.getRoot().get('cards') === null) {
        const collaborativeCards = model.createList([]);
        model.getRoot().set('cards', collaborativeCards);
      }
      // Lazily instantiate the collaborative arrows array.
      if (model.getRoot().get('arrows') === null) {
        const collaborativeArrows = model.createList([]);
        model.getRoot().set('arrows', collaborativeArrows);
      }
    });
  }

  // @override
  close() {
    if (this.realtimeDocument) {
      this.realtimeDocument.close();
      this.googleRealtimeService.currentDocument.next(null);
    }
  }

  // @override
  getCollaborators(): Observable<Collaborator[]> {
    return this.googleRealtimeService.collaborators;
  }

  // @override
  getModel(): Observable<DocumentModel|null> {
    // TODO(eyuelt): This seems wrong. I'm creating a new subscription on each
    // call and never unsubscribing.
    const model = new BehaviorSubject<DocumentModel|null>(null);
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      model.next(currentDocument ? currentDocument.getModel() : null);
    });
    return model;
  }


  // @override
  createCard(position: Point = {x: 0, y: 0},
             text: string = '',
             selected = false): Card|null {
    if (this.realtimeDocument) {
      const card = this.realtimeDocument.getModel().create(Card);
      card.position = position;
      card.text = text;
      card.selected = selected;
      return card;
    }
    return null;
  }

  // @override
  createArrow(tailPosition: Point = {x: 0, y: 0},
              tipPosition: Point = {x: 0, y: 0}): Arrow|null {
    if (this.realtimeDocument) {
      const arrow = this.realtimeDocument.getModel().create(Arrow);
      arrow.tailPosition = tailPosition;
      arrow.tipPosition = tipPosition;
      return arrow;
    }
    return null;
  }

  // @override
  clearAllDocuments() {
    // do nothing
  }

  // @override
  // This function calls the given function within a Realtime compound
  // operation, which treats the function as a transaction.
  transaction(fn: () => void) {
    if (this.realtimeDocument) {
      const model = this.realtimeDocument.getModel();
      model.beginCompoundOperation();
      fn();
      model.endCompoundOperation();
    }
  }

}
