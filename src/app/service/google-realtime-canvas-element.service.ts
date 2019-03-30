import { Injectable } from '@angular/core';
import { Arrow, Card } from '../model';
import { OBJECT_CHANGED } from 'src/app/service';
import { CanvasElementService, ArrowElementModel, CardElementModel } from '../canvas/canvas-element.service';
import { Point } from 'src/app/model/geometry';
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

      this.collaborativeCards = model.getRoot().get('cards');
      this.collaborativeArrows = model.getRoot().get('arrows');
      this.updateElements();

      // If anything in the document changes, update all of the canvas elements.
      // TODO(eyuelt): only update the specific canvas elements that changed.
      model.getRoot()
        .addEventListener(OBJECT_CHANGED, this.updateElements.bind(this));
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
  // Creates a card and adds it to the canvas.
  addCard(position: Point = {x: 0, y: 0},
          text: string = '',
          selected = false): CardElementModel|null {
    if (this.realtimeModel && this.collaborativeCards) {
      const card = this.realtimeModel.create(Card);
      card.position = position;
      card.text = text;
      card.selected = selected;
      this.collaborativeCards.push(card);
      return card;
    }
    return null;
  }

  // @override
  // Creates an arrow and adds it to the canvas.
  addArrow(tailPosition: Point = {x: 0, y: 0},
           tipPosition: Point = {x: 0, y: 0}): ArrowElementModel|null {
    if (this.realtimeModel && this.collaborativeArrows) {
      const arrow = this.realtimeModel.create(Arrow);
      arrow.tailPosition = tailPosition;
      arrow.tipPosition = tipPosition;
      this.collaborativeArrows.push(arrow);
      return arrow;
    }
    return null;
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
