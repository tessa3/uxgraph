import { Component } from '@angular/core';
import { DocumentService } from 'src/app/service/document.service';
import { ElemModelUtils, ArrowConnectionType } from 'src/app/utils/elem-model-utils';

@Component({
  selector: 'uxg-secondary-toolbar',
  templateUrl: 'secondary-toolbar.html',
  styleUrls: ['secondary-toolbar.css']
})
export class SecondaryToolbarComponent {
  constructor(private documentService: DocumentService) {}

  onAddCardButtonPressed(event: MouseEvent) {
    this.documentService.transaction(() => {
      const card = this.documentService.createCard();
      const arrow = this.documentService.createArrow();
      if (card && arrow) {
        ElemModelUtils.connectArrowAndCard(arrow, card, ArrowConnectionType.OUTGOING);
      }
    });
  }
}
