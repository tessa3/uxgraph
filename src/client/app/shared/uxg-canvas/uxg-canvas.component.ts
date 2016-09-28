import { Component, Input } from '@angular/core';
import { CardComponent} from '../../shared/index';
import '../../shared/card/card'

/**
 * This class represents the UxgCanvas component.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-canvas',
  templateUrl: 'uxg-canvas.component.html',
  styleUrls: ['uxg-canvas.component.css'],
  directives: [CardComponent]
})
export class UxgCanvasComponent {
  card: Card = null;
  constructor() {
    this.card = new Card(50, 50, 50);
  }
}
