import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {SharedModule} from '../shared/shared.module';
import {SecondaryToolbarComponent} from './secondary-toolbar/secondary-toolbar';
import {CanvasComponent} from '../shared/canvas/canvas.component';


@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    CanvasComponent,
    GraphComponent,
    SecondaryToolbarComponent
  ],
  exports: [
    GraphComponent
  ]
})
export class GraphModule {
}
