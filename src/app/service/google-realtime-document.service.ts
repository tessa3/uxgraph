import { Injectable } from '@angular/core';
import { GoogleRealtimeService } from './google-realtime.service';
import { DocumentService, DocumentModel } from './document.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Collaborator } from '../model/collaborator';

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

}
