import {Component, Input, OnInit} from '@angular/core';
import {
  GoogleRealtimeService,
  DriveFile
} from '../../service/google-realtime.service';

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
    name: 'Loading...',

    // Put temporary values into every other property.
    id: 'UNKNOWN',
    mimeType: 'UNKNOWN',
    kind: 'UNKNOWN'
  };

  constructor(private googleRealtimeService: GoogleRealtimeService) {
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
    this.currentGraph.name = newGraphName;

    console.log('Will update graph name...');

    this.googleRealtimeService.updateFile(this.currentGraph)
        .subscribe((driveFile: DriveFile) => {
          console.log('Did update graph name: ', driveFile);
        });
  }


}
