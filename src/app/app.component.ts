import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetadataFileService } from './service/metadata-file.service';
import { DocumentService } from './service/document.service';

@Component({
  selector: 'uxg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private titleService: Title,
              documentService: DocumentService,
              metadataFileService: MetadataFileService) {
    this.titleService.setTitle('uxgraph');
    // TODO: only do this in debug mode
    (window as any).clearData = () => {
      console.log('Not yet implemented.');
      metadataFileService.clearAllFiles();
      documentService.clearAllDocuments();
      // TODO: redirect to home page
    };
  }
}
