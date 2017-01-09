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
import {UserIconComponent} from './user-icon/user-icon.component';
import {ToIterablePipe} from './canvas/to-iterable.pipe';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  declarations: [
    ToIterablePipe,
    CardComponent,
    ArrowComponent,
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
