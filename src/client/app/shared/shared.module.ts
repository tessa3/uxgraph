import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SidePanelComponent} from './side-panel/index';
import {AppHeaderComponent} from './app-header/index';
import {GraphPreviewComponent} from './graph-preview/index';
import {NameListService} from './name-list/index';
import {GraphPreviewListService} from './graph-preview-list/index';
import {GoogleRealtimeService} from "./google-realtime/google-realtime.service";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    AppHeaderComponent,
    GraphPreviewComponent,
    SidePanelComponent
  ],
  exports: [
    AppHeaderComponent,
    CommonModule,
    FormsModule,
    GraphPreviewComponent,
    RouterModule,
    SidePanelComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        GoogleRealtimeService,
        GraphPreviewListService,
        NameListService,
      ]
    };
  }
}
