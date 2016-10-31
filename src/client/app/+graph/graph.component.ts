import { Component } from '@angular/core';
import { CanvasComponent } from '../shared/index';

/**
 * This class represents the lazy loaded GraphComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  directives: [CanvasComponent]
})
export class GraphComponent { }
