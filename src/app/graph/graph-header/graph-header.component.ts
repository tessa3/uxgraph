import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Collaborator} from '../../model/collaborator';
import {Title} from '@angular/platform-browser';
import { DocumentService } from 'src/app/service/document.service';
import { MetadataFileService, MetadataFile } from 'src/app/service/metadata-file.service';

/**
 * This class represents the App Header component.
 */
@Component({
  selector: 'uxg-graph-header',
  templateUrl: 'graph-header.component.html',
  styleUrls: ['graph-header.component.css']
})
export class GraphHeaderComponent implements OnInit {

  @Input() graphId!: string;

  currentGraph: MetadataFile = {
    // Give a temporary name to this graph while we load the real name...
    name: 'Loading...',
    // ... and put temporary values into every other property of this graph.
    id: 'UNKNOWN'
  };

  collaborators: Observable<Collaborator[]>;

  constructor(private metadataFileService: MetadataFileService,
              private titleService: Title,
              documentService: DocumentService) {
    // We can't do anything in the constructor yet because the [graphId]
    // @Input from the template hasn't been bound.
    //
    // Angular will call our "ngOnInit()" method after that @Input has been
    // bound.
    this.collaborators = documentService.getCollaborators();
  }

  ngOnInit(): void {
    // Once the @Input binding is available, fetch the rest of the data to put
    // into "this.currentGraph".
    const file = this.metadataFileService.getFile(this.graphId);
    if (file !== null) {
      file.subscribe((driveFile: MetadataFile) => {
        this.currentGraph = driveFile;
        this.titleService.setTitle(this.currentGraph.name + ' | uxgraph');

        // TODO(girum): Save the filename into the Realtime API for
        // live-updates to other users.
      });
    }
  }

  updateGraphTitle(newGraphName: string): void {
    // Eagerly assume that the PATCH request that we're about to send out
    // will work correctly.
    this.currentGraph.name = newGraphName;

    // Once the PATCH request goes through, update the rest of the
    // "this.currentGraph" object to reflect the truth that the Google Drive API
    // just returned to us.
    const file = this.metadataFileService.updateFile(this.currentGraph);
    if (file !== null) {
      file.subscribe((driveFile: MetadataFile) => {
        this.currentGraph = driveFile;
      });
    }
  }

  openShareDialog(): void {
    this.metadataFileService.openShareDialog(this.currentGraph.id);
  }


}
