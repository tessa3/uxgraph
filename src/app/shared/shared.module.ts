import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FabComponent } from './fab/index';
import { ToIterablePipe } from './pipe/to-iterable.pipe';
import { CanvasElementService } from '../canvas/canvas-element.service';
import { GoogleRealtimeCanvasElementService } from '../service/google-realtime-canvas-element.service';
import { DocumentService } from '../service/document.service';
import { GoogleRealtimeDocumentService } from '../service/google-realtime-document.service';

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
    ToIterablePipe,
  ],
  exports: [
    FabComponent,
    ToIterablePipe,
  ],
  providers: [
    { provide: DocumentService, useClass: GoogleRealtimeDocumentService },
    { provide: CanvasElementService, useClass: GoogleRealtimeCanvasElementService }
  ]
})
export class SharedModule {
}
