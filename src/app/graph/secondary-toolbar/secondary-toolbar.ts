import {Component} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {
  CanvasElementManagerService,
  ArrowConnectionType
} from 'src/app/canvas/canvas-element-manager/canvas-element-manager.service';

@Component({
  selector: 'uxg-secondary-toolbar',
  templateUrl: 'secondary-toolbar.html',
  styleUrls: ['secondary-toolbar.css']
})
export class SecondaryToolbarComponent {
  constructor(
    private canvasService: CanvasService,
    private canvasElementManagerService: CanvasElementManagerService) {
  }

  onAddCardButtonPressed(event: MouseEvent) {
    this.canvasElementManagerService.realtimeTransaction(() => {
      const card = this.canvasElementManagerService.addCard();
      const arrow = this.canvasElementManagerService.addArrow();
      if (card !== null && arrow !== null) {
        this.canvasElementManagerService.connectArrowAndCard(arrow, card, ArrowConnectionType.OUTGOING);
        this.canvasService.repositionArrow(arrow);
      }
    });
  }
}
