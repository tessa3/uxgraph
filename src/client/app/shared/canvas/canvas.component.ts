import { Component, Input } from '@angular/core';
import { CardComponent } from '../../shared/index';
import { CanvasService } from './canvas.service'; // Why doesn't ./index work?

/**
 * This class represents the Canvas component.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-canvas',
  templateUrl: 'canvas.component.html',
  styleUrls: ['canvas.component.css'],
  directives: [CardComponent],
  providers: [CanvasService]
})
export class CanvasComponent {
  constructor(public canvasService: CanvasService) {}
}
