import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collaborator } from '../model/collaborator';
import { Point, Card, Arrow } from '../model';

export type DocumentModel = gapi.drive.realtime.Model;

/**
 * A service to maintain the current document. The document contains the state
 * of the uxgraph, including the model and the collaborators.
 */
@Injectable()
export abstract class DocumentService {
  constructor() {}
  abstract load(documentId: string): void;
  abstract close(): void;
  abstract getCollaborators(): Observable<Collaborator[]>;
  abstract getModel(): Observable<DocumentModel|null>;
  abstract createCard(position?: Point, text?: string, selected?: boolean): Card|null;
  abstract createArrow(tailPosition?: Point, tipPosition?: Point): Arrow|null;
}