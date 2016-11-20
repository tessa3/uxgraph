import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {SharedModule} from '../shared/shared.module';
import {SecondaryToolbarComponent} from './secondary-toolbar/secondary-toolbar';


@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    GraphComponent,
    SecondaryToolbarComponent
  ],
  exports: [
    GraphComponent
  ]
})
export class GraphModule {
}
