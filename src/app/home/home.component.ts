import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DriveFile} from '../model/drive-file';
import {StorageService} from '../service/storage.service';

/**
 * This class represents the HomeComponent.
 */
@Component({
  selector: 'uxg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnDestroy {

  userLoggedIn = false;
  graphPreviews: DriveFile[] = [];

  private userLoggedInSub: Subscription;
  private listFilesSub: Subscription;
  private createGraphSub?: Subscription;

  /**
   * Creates an instance of the HomeComponent.
   */
  constructor(private storageService: StorageService,
              private router: Router) {
    this.userLoggedInSub = this.storageService.getUserLoggedIn().subscribe((userLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
    });

    this.listFilesSub = this.storageService.listFiles()
        .subscribe((files) => {
          this.graphPreviews = files;
        });
  }

  authorize() {
    this.storageService.authorize(true);
  }

  createNewGraph() {
    this.createGraphSub = this.storageService
        .createFile('Untitled')
        .subscribe((newGraph: DriveFile) => {
          this.router.navigateByUrl('/graph/' + newGraph.id);
        });
  }

  ngOnDestroy() {
    this.userLoggedInSub.unsubscribe();
    this.listFilesSub.unsubscribe();
    if (this.createGraphSub !== undefined) {
      this.createGraphSub.unsubscribe();
    }
  }

}
