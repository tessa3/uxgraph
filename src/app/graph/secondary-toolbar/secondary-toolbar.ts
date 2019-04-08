import {Component} from '@angular/core';
import {
  CanvasElementService,
  ArrowConnectionType
} from 'src/app/canvas/canvas-element.service';
import { Arrow, Card } from 'src/app/model';
import { DocumentService } from 'src/app/service/document.service';

@Component({
  selector: 'uxg-secondary-toolbar',
  templateUrl: 'secondary-toolbar.html',
  styleUrls: ['secondary-toolbar.css']
})
export class SecondaryToolbarComponent {
  constructor(
    private canvasElementService: CanvasElementService,
    private documentService: DocumentService) {
  }

  onAddCardButtonPressed(event: MouseEvent) {
    this.canvasElementService.transaction(() => {
      const card = this.documentService.createCard();
      const arrow = this.documentService.createArrow();
      if (card && arrow) {
        this.canvasElementService.addCard(card);
        this.canvasElementService.addArrow(arrow);
        this.canvasElementService.connectArrowAndCard(arrow, card, ArrowConnectionType.OUTGOING);
        this.canvasElementService.repositionArrow(arrow);
      }
    });
  }
}
