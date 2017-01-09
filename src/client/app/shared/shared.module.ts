import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';
import {FabComponent} from './fab/index';
import {GraphPreviewListService} from '../home/graph-preview-list/index';
import {TextareaAutosizeDirective} from './textarea-autosize/index';
import {GoogleDriveService} from '../service/google-drive.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    FabComponent,
    TextareaAutosizeDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FabComponent,
    TextareaAutosizeDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        GoogleDriveService,
        GoogleRealtimeService,
        GraphPreviewListService,
      ]
    };
  }
}
