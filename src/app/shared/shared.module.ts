import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FabComponent } from './fab/index';
import { ToIterablePipe } from './pipe/to-iterable.pipe';

import { MetadataFileService } from '../service/metadata-file.service';
import { DocumentService } from '../service/document.service';
import { CanvasElementService } from '../canvas/canvas-element.service';
import { GoogleDriveMetadataFileService } from '../service/google-drive-metadata-file.service';
import { GoogleRealtimeDocumentService } from '../service/google-realtime-document.service';
import { GoogleRealtimeCanvasElementService } from '../service/google-realtime-canvas-element.service';
import { InMemoryMetadataFileService } from '../service/in-memory-metadata-file.service';
import { InMemoryDocumentService } from '../service/in-memory-document.service';
import { InMemoryCanvasElementService } from '../service/in-memory-canvas-element.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpModule,  // tslint:disable-line:deprecation
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
    // { provide: MetadataFileService, useClass: GoogleDriveMetadataFileService },
    // { provide: DocumentService, useClass: GoogleRealtimeDocumentService },
    // { provide: CanvasElementService, useClass: GoogleRealtimeCanvasElementService },
    { provide: MetadataFileService, useClass: InMemoryMetadataFileService },
    { provide: DocumentService, useClass: InMemoryDocumentService },
    { provide: CanvasElementService, useClass: InMemoryCanvasElementService },
  ]
})
export class SharedModule {
}
