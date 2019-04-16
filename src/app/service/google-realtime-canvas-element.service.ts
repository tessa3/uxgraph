import { Injectable } from '@angular/core';
import { Arrow, Card } from '../model';
import { OBJECT_CHANGED } from 'src/app/service';
import { CanvasElementService, ArrowElementModel, CardElementModel } from '../canvas/canvas-element.service';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;
import { DocumentService } from './document.service';
import { typeIs } from '../utils/runtime-utils';
import { GoogleRealtimeDocumentService } from './google-realtime-document.service';

@Injectable()
export class GoogleRealtimeCanvasElementService extends CanvasElementService {
  // The Google Realtime collaborative arrays of backing the canvas elements.
  private collaborativeCards: CollaborativeList<Card>|undefined;
  private collaborativeArrows: CollaborativeList<Arrow>|undefined;

  // A reference to the model of the Realtime Document. Used here to create
  // cards and arrows.
  private realtimeModel: gapi.drive.realtime.Model|null = null;

  constructor(documentService: DocumentService) {
    super();
    typeIs(documentService, GoogleRealtimeDocumentService.name);
    documentService.getModel().subscribe((model) => {
      this.realtimeModel = model as gapi.drive.realtime.Model|null;
      if (model === null) { return; }

      const modelRoot = (model as gapi.drive.realtime.Model).getRoot();
      this.collaborativeCards = modelRoot.get('cards');
      this.collaborativeArrows = modelRoot.get('arrows');
      this.updateElements();

      // If anything in the document changes, update all of the canvas elements.
      // TODO(eyuelt): only update the specific canvas elements that changed.
      modelRoot.addEventListener(OBJECT_CHANGED, this.updateElements.bind(this));
    });
  }

  // Update the canvas element models arrays used in the superclass. Notify the
  // canvas elements that there was a data update.
  updateElements() {
    if (this.collaborativeCards) {
      this.cards = this.collaborativeCards.asArray();
    }
    if (this.collaborativeArrows) {
      this.arrows = this.collaborativeArrows.asArray();
    }
    this.notifyListeners();
  }

  // @override
  // Adds the card to the canvas.
  addCard(card: CardElementModel) {
    if (this.collaborativeCards) {
      typeIs(card, Card.name);
      this.collaborativeCards.push(card as Card);
    }
  }

  // @override
  // Adds the arrow to the canvas.
  addArrow(arrow: ArrowElementModel) {
    if (this.collaborativeArrows) {
      typeIs(arrow, Arrow.name);
      this.collaborativeArrows.push(arrow as Arrow);
    }
  }

  // @override
  // This function calls the given function within a Realtime compound
  // operation, which treats the function as a transaction.
  transaction(fn: () => void) {
    if (this.realtimeModel !== null) {
      this.realtimeModel.beginCompoundOperation();
      fn();
      this.realtimeModel.endCompoundOperation();
    }
  }

}
