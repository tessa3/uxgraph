import {Component, Input, OnInit} from '@angular/core';
import {GoogleRealtimeService} from '../../service/google-realtime.service';
import {DriveFile} from '../../model/drive-file';
import {Observable} from 'rxjs';
import {Collaborator} from '../../model/collaborator';

/**
 * This class represents the App Header component.
 */
@Component({
  moduleId: module.id,
  selector: 'graph-header',
  templateUrl: 'graph-header.component.html',
  styleUrls: ['graph-header.component.css']
})
export class GraphHeaderComponent implements OnInit {

  @Input() graphId: string;

  currentGraph: DriveFile = {
    // Give a temporary name to this graph while we load the real name...
    name: 'Loading...',

    // ... and put temporary values into every other property of this graph.
    id: 'UNKNOWN',
    mimeType: 'UNKNOWN',
    kind: 'UNKNOWN'
  };

  collaborators: Observable<Collaborator[]>;

  constructor(private googleRealtimeService: GoogleRealtimeService) {
    // We can't do anything in the constructor yet because the [graphId]
    // @Input from the template hasn't been bound.
    //
    // Angular will call our "ngOnInit()" method after that @Input has been
    // bound.
    this.collaborators = googleRealtimeService.collaborators;
  }

  ngOnInit(): void {
    // Once the @Input binding is available, fetch the rest of the data to put
    // into "this.currentGraph".
    this.googleRealtimeService.getFile(this.graphId)
        .subscribe((driveFile: DriveFile) => {
          this.currentGraph = driveFile;

          // TODO(girum): Save the filename into the Realtime API for
          // live-updates to other users.
        });
  }

  updateGraphTitle(newGraphName: string): void {
    // Eagerly assume that the PATCH request that we're about to send out
    // will work correctly.
    this.currentGraph.name = newGraphName;

    // Once the PATCH request goes through, update the rest of the
    // "this.currentGraph" object to reflect the truth that the Google Drive API
    // just returned to us.
    this.googleRealtimeService.updateFile(this.currentGraph)
        .subscribe((driveFile: DriveFile) => {
          this.currentGraph = driveFile;
        });
  }


}
