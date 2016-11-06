import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {GraphPreviewListService} from '../shared/index';
import {
    GoogleRealtimeService,
    DriveFile
} from "../shared/google-realtime/google-realtime.service";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  graphPreviews: DriveFile[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * GraphPreviewListService.
   *
   * @param googleRealtimeService
   * @param changeDetector
   */
  constructor(private googleRealtimeService: GoogleRealtimeService,
              private changeDetector: ChangeDetectorRef) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.googleRealtimeService.listFiles()
        .subscribe((driveFiles: DriveFile[]) => {
          this.graphPreviews = driveFiles;

          // TODO(girum): Why do I need to call the change detector here?
          this.changeDetector.detectChanges();
        });
  }

  authorize() {
    this.googleRealtimeService.authorize(true);
  }

}
