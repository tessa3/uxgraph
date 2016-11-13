import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {
    GoogleRealtimeService,
    DriveFile
} from '../service/google-realtime/google-realtime.service';
import {Router} from '@angular/router';

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

  userLoggedIn: boolean = false;
  graphPreviews: DriveFile[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * GraphPreviewListService.
   *
   * @param googleRealtimeService
   * @param changeDetector
   */
  constructor(private googleRealtimeService: GoogleRealtimeService,
              private changeDetector: ChangeDetectorRef,
              private router: Router) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.googleRealtimeService.oauthToken.subscribe((oauthToken) => {
      if (!!oauthToken) {
        this.userLoggedIn = true;
      }
    });

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

  createNewGraph() {
    this.googleRealtimeService.createFile('Untitled uxgraph')
        .subscribe((newGraph: DriveFile) => {
          console.log('Created new graph: ', newGraph);
          this.router.navigateByUrl('/graph/' + newGraph.id);
        });
  }

}
