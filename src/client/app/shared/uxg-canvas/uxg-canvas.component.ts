import { Component, Input } from '@angular/core';
import { CardComponent } from '../../shared/index';
import { UxgCanvasService } from './uxg-canvas.service'; // Why doesn't ./index work?

/**
 * This class represents the UxgCanvas component.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-canvas',
  templateUrl: 'uxg-canvas.component.html',
  styleUrls: ['uxg-canvas.component.css'],
  directives: [CardComponent],
  providers: [UxgCanvasService]
})
export class UxgCanvasComponent {
  constructor(public canvasService: UxgCanvasService) {}
}
