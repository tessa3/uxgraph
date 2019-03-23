import {Injectable} from '@angular/core';
import { Arrow, Card } from '../model';
import { GoogleRealtimeService, OBJECT_CHANGED } from 'src/app/service';
import { CanvasElementService, ArrowElementModel, CardElementModel } from '../canvas/canvas-element.service';
import { Point } from 'src/app/model/geometry';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;

@Injectable()
export class GoogleRealtimeCanvasElementService extends CanvasElementService {
  // The Google Realtime collaborative arrays of backing the canvas elements.
  private collaborativeCards: CollaborativeList<Card>|undefined;
  private collaborativeArrows: CollaborativeList<Arrow>|undefined;
  // A reference to the Realtime Document. Used here to create Cards and Arrows.
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    super();
    this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
      this.realtimeDocument = currentDocument;
      if (currentDocument === null) {
        return;
      }

      const model = currentDocument.getModel();

      // Lazily instantiate the collaborative cards array.
      if (model.getRoot().get('cards') === null) {
        console.log('no "cards" object at root');
        const collaborativeCards = model.createList([]);
        model.getRoot().set('cards', collaborativeCards);
      }

      this.collaborativeCards = model.getRoot().get('cards');

      // Lazily instantiate the collaborative arrows array.
      if (model.getRoot().get('arrows') === null) {
        console.log('no "arrows" object at root');
        const collaborativeArrows = model.createList([]);
        model.getRoot().set('arrows', collaborativeArrows);
      }

      this.collaborativeArrows = model.getRoot().get('arrows');

      this.updateElements();

      // If anything in the document changes, update all of the canvas elements.
      // TODO(eyuelt): only update the specific canvas elements that changed.
      currentDocument.getModel().getRoot()
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
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model && this.collaborativeCards) {
        const card = model.create(Card);
        card.position = position;
        card.text = text;
        card.selected = selected;
        this.collaborativeCards.push(card);
        return card;
      }
    }
    return null;
  }

  // @override
  // Creates an arrow and adds it to the canvas.
  addArrow(tailPosition: Point = {x: 0, y: 0},
           tipPosition: Point = {x: 0, y: 0}): ArrowElementModel|null {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      if (model && this.collaborativeArrows) {
        const arrow = model.create(Arrow);
        arrow.tailPosition = tailPosition;
        arrow.tipPosition = tipPosition;
        this.collaborativeArrows.push(arrow);
        return arrow;
      }
    }
    return null;
  }

  // @override
  // This function calls the given function within a Realtime compound
  // operation, which treats the function as a transaction.
  transaction(fn: () => void) {
    if (this.realtimeDocument !== null) {
      const model = this.realtimeDocument.getModel();
      model.beginCompoundOperation();
      fn();
      model.endCompoundOperation();
    }
  }

}
