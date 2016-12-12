import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {SharedModule} from '../shared/shared.module';
import {SecondaryToolbarComponent} from './secondary-toolbar/secondary-toolbar';
import {CanvasComponent} from './canvas/canvas.component';
import {CardComponent} from './card/card.component';
import {SidePanelComponent} from './side-panel/side-panel.component';
import {GraphHeaderComponent} from './graph-header/graph-header.component';
import {UserIconComponent} from './user-icon/user-icon.component';


@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    CardComponent,
    CanvasComponent,
    GraphComponent,
    UserIconComponent,
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
