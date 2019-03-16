import {Component} from '@angular/core';
import {CanvasService, ArrowConnectionType} from '../../service/canvas.service';

@Component({
  selector: 'uxg-secondary-toolbar',
  templateUrl: 'secondary-toolbar.html',
  styleUrls: ['secondary-toolbar.css']
})
export class SecondaryToolbarComponent {
  constructor(private canvasService: CanvasService) {
  }

  onAddCardButtonPressed(event: MouseEvent) {
    this.canvasService.realtimeTransaction(() => {
      const card = this.canvasService.addCard();
      const arrow = this.canvasService.addArrow();
      if (card !== null && arrow !== null) {
        this.canvasService.connectArrowAndCard(arrow, card, ArrowConnectionType.OUTGOING);
        this.canvasService.repositionArrow(arrow);
      }
    });
  }
}
