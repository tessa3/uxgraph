import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GraphComponent } from './graph.component';
import { SharedModule } from '../shared/shared.module';
import { SecondaryToolbarComponent } from './secondary-toolbar/secondary-toolbar';
import { CanvasModule } from '../canvas/canvas.module';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { GraphHeaderComponent } from './graph-header/graph-header.component';
import { UserIconComponent } from './user-icon/user-icon.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    CanvasModule,
  ],
  declarations: [
    GraphComponent,
    UserIconComponent,
    GraphHeaderComponent,
    SidePanelComponent,
    SecondaryToolbarComponent,
  ],
  exports: [
    GraphComponent,
  ]
})
export class GraphModule {
}
