import {Component} from '@angular/core';
import {
  CanvasElementService,
  ArrowConnectionType
} from 'src/app/canvas/canvas-element.service';

@Component({
  selector: 'uxg-secondary-toolbar',
  templateUrl: 'secondary-toolbar.html',
  styleUrls: ['secondary-toolbar.css']
})
export class SecondaryToolbarComponent {
  constructor(
    private canvasElementService: CanvasElementService) {
  }

  onAddCardButtonPressed(event: MouseEvent) {
    this.canvasElementService.transaction(() => {
      const card = this.canvasElementService.addCard();
      const arrow = this.canvasElementService.addArrow();
      if (card !== null && arrow !== null) {
        this.canvasElementService.connectArrowAndCard(arrow, card, ArrowConnectionType.OUTGOING);
        this.canvasElementService.repositionArrow(arrow);
      }
    });
  }
}
