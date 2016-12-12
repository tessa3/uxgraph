import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {SharedModule} from '../shared/shared.module';
import {SecondaryToolbarComponent} from './secondary-toolbar/secondary-toolbar';
import {CanvasComponent} from './canvas/canvas.component';
import {CardComponent} from './card/card.component';
import {ArrowComponent} from './arrow/arrow.component';
import {SidePanelComponent} from './side-panel/side-panel.component';
import {GraphHeaderComponent} from './graph-header/graph-header.component';


@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    CardComponent,
    ArrowComponent,
    CanvasComponent,
    GraphComponent,
    GraphHeaderComponent,
    SidePanelComponent,
    SecondaryToolbarComponent
  ],
  exports: [
    GraphComponent
  ]
})
export class GraphModule {
}
