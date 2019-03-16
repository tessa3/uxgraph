import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DriveFile} from '../model/drive-file';
import {GoogleDriveService} from '../service/google-drive.service';

/**
 * This class represents the HomeComponent.
 */
@Component({
  selector: 'uxg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnDestroy {

  userLoggedIn: boolean = false;
  graphPreviews: DriveFile[] = [];

  private oauthSub: Subscription;
  private listFilesSub: Subscription;
  private createGraphSub?: Subscription;

  /**
   * Creates an instance of the HomeComponent.
   */
  constructor(private googleDriveService: GoogleDriveService,
              private router: Router) {
    this.oauthSub = this.googleDriveService.oauthToken
        .subscribe((oauthToken) => {
          if (!!oauthToken) {
            this.userLoggedIn = true;
          }
        });

    this.listFilesSub = this.googleDriveService.listFiles()
        .subscribe((driveFiles: DriveFile[]) => {
          this.graphPreviews = driveFiles;
        });
  }

  authorize() {
    this.googleDriveService.authorize(true);
  }

  createNewGraph() {
    this.createGraphSub = this.googleDriveService
        .createFile('Untitled')
        .subscribe((newGraph: DriveFile) => {
          this.router.navigateByUrl('/graph/' + newGraph.id);
        });
  }

  ngOnDestroy() {
    this.oauthSub.unsubscribe();
    this.listFilesSub.unsubscribe();
    if (this.createGraphSub !== undefined) {
      this.createGraphSub.unsubscribe();
    }
  }

}
