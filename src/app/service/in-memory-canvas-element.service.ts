import { Injectable } from '@angular/core';
import { CanvasElementService } from '../canvas/canvas-element.service';
import { DocumentService } from './document.service';
import { InMemoryDocumentModel } from './in-memory-document.service';
import { typeIs } from '../utils/runtime-utils';

@Injectable()
export class InMemoryCanvasElementService extends CanvasElementService {

  constructor(documentService: DocumentService) {
    super();

    // When the model is updated, update the elems in the CanvasElementService.
    // Note: This doesn't fire when elements or connections are changed.
    documentService.getModel().subscribe((m) => {
      if (m === null) { return; }
      typeIs(m, InMemoryDocumentModel.name);
      const model = m as InMemoryDocumentModel;
      this.cards = model.cards;
      this.arrows = model.arrows;
    });
  }

  // We don't allow directly adding to the canvas because we want this canvas
  // to reflect the model of the documentService.

  // @override
  addCard() {
    console.error('Adding cards directly to the canvas is not permitted.');
  }
  // @override
  addArrow() {
    console.error('Adding arrows directly to the canvas is not permitted.');
  }

}
