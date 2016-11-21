import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {GraphHeaderComponent} from './graph-header/index';
import {GoogleRealtimeService} from '../service/google-realtime/google-realtime.service';
import {HomeHeaderComponent} from './home-header/home-header.component';
import {SidePanelComponent} from './side-panel/index';
import {FabComponent} from './fab/index';
import {GraphPreviewComponent} from './graph-preview/index';
import {GraphPreviewListService} from './graph-preview-list/index';
import {CardComponent} from './card/card.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    CardComponent,
    GraphHeaderComponent,
    GraphPreviewComponent,
    HomeHeaderComponent,
    SidePanelComponent,
    FabComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    GraphHeaderComponent,
    GraphPreviewComponent,
    HomeHeaderComponent,
    RouterModule,
    SidePanelComponent,
    FabComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        GoogleRealtimeService,
        GraphPreviewListService,
      ]
    };
  }
}
