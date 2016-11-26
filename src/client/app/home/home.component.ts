import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {
  GoogleRealtimeService,
  DriveFile
} from '../service/google-realtime/google-realtime.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit, OnDestroy {

  userLoggedIn: boolean = false;
  graphPreviews: DriveFile[] = [];

  private oauthSub: Subscription;
  private listFilesSub: Subscription;
  private createGraphSub: Subscription;

  /**
   * Creates an instance of the HomeComponent with the injected
   * GraphPreviewListService.
   *
   * @param googleRealtimeService
   * @param zone
   * @param router
   */
  constructor(private googleRealtimeService: GoogleRealtimeService,
              private zone: NgZone,
              private router: Router) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.oauthSub = this.googleRealtimeService.oauthToken
        .subscribe((oauthToken) => {
          this.zone.run(() => {
            if (!!oauthToken) {
              this.userLoggedIn = true;
            }
          });
        });

    this.listFilesSub = this.googleRealtimeService.listFiles()
        .subscribe((driveFiles: DriveFile[]) => {
          this.zone.run(() => {
            this.graphPreviews = driveFiles;
          });
        });
  }

  authorize() {
    this.googleRealtimeService.authorize(true);
  }

  createNewGraph() {
    this.createGraphSub = this.googleRealtimeService
        .createFile('Untitled uxgraph')
        .subscribe((newGraph: DriveFile) => {
          this.router.navigateByUrl('/graph/' + newGraph.id);
        });
  }

  ngOnDestroy() {
    this.oauthSub.unsubscribe();
    this.listFilesSub.unsubscribe();
    if (this.createGraphSub) {
      this.createGraphSub.unsubscribe();
    }
  }

}
