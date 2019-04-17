import { Observable } from 'rxjs';
import { Collaborator } from '../model/collaborator';
import { InMemoryDocumentModel } from './in-memory-document.service';
import { Point, Card, Arrow } from '../model';

// TODO: this should be an interface rather than a union type
export type DocumentModel = gapi.drive.realtime.Model|InMemoryDocumentModel;

/**
 * A service to maintain the current document. The document contains the state
 * of the uxgraph, including the model and the collaborators.
 */
export abstract class DocumentService {
  constructor() {}
  abstract load(documentId: string): void;
  abstract close(): void;
  abstract getCollaborators(): Observable<Collaborator[]>;
  abstract getModel(): Observable<DocumentModel|null>;
  // TODO: There should be a fn that gets the document for a given file id.

  abstract createCard(position?: Point, text?: string, selected?: boolean): Card|null;
  abstract createArrow(tailPosition?: Point, tipPosition?: Point): Arrow|null;

  abstract clearAllDocuments(): void;
}
