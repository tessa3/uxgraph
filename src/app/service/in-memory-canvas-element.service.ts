import { Injectable } from '@angular/core';
import { CanvasElementService } from '../canvas/canvas-element.service';
import { DocumentService } from './document.service';
import { InMemoryDocumentModel } from './in-memory-document.service';

@Injectable()
export class InMemoryCanvasElementService extends CanvasElementService {

  constructor(documentService: DocumentService) {
    super();

    // TODO: any time something changes, we have to let the canvas elements know
    // because, for some reason, change detection isn't working.
    // TODO: we set the interval to be fast enough to not be annoying but also
    // slow enough to be definitely noticeable, so that we fix it.
    window.setInterval(() => { this.notifyListeners(); }, 150);

    documentService.getModel().subscribe((m) => {
      const model = m as InMemoryDocumentModel|null;
      if (model === null) { return; }
      this.cards = model.cards;
      this.arrows = model.arrows;
      this.notifyListeners();
    });
  }

}
