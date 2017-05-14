import {Injectable, ApplicationRef} from '@angular/core';
import 'rxjs/add/operator/switch';
import {BehaviorSubject} from 'rxjs';
import {Collaborator} from '../model/collaborator';
import {Router} from '@angular/router';
import {GoogleDriveService} from './google-drive.service';
import Document = gapi.drive.realtime.Document;
import ObjectChangedEvent = gapi.drive.realtime.ObjectChangedEvent;


const COLLABORATOR_JOINED = 'collaborator_joined';
const COLLABORATOR_LEFT = 'collaborator_left';
export const OBJECT_CHANGED = 'object_changed';

const FORBIDDEN = 'forbidden';


/**
 * A service to authenticate and interact with Google's Realtime API.
 * Includes Google Drive API interaction.
 */
@Injectable()
export class GoogleRealtimeService {

  currentDocument: BehaviorSubject<Document> =
      new BehaviorSubject<Document>(null);

  collaborators: BehaviorSubject<Collaborator[]> =
      new BehaviorSubject<Collaborator[]>([]);


  constructor(private googleDriveService: GoogleDriveService,
              private applicationRef: ApplicationRef,
              private router: Router) {
  }


  /**
   * Loads the Realtime-version of a Google Drive file by Id.
   * Again, this code will automatically run anytime this.oauthToken changes
   * according to RxJS.
   *
   * @param driveFileId The ID of the Google Drive file you'd like to load
   *                    Realtime for.
   */
  loadRealtimeDocument(driveFileId: string) {
    this.googleDriveService.oauthToken.subscribe(() => {
      gapi.drive.realtime.load(driveFileId, (document) => {
        // Read the current array of collaborators from the document.
        this.collaborators.next(document.getCollaborators());

        // Also sign up for changes in the collaborators list.
        document.addEventListener(COLLABORATOR_JOINED, () => {
          this.collaborators.next(document.getCollaborators());
        });
        document.addEventListener(COLLABORATOR_LEFT, () => {
          this.collaborators.next(document.getCollaborators());
        });

        // Hold onto the current document in-memory.
        this.currentDocument.next(document);

        // Wire up the global change detector to run on every change.
        this.applicationRef.tick();
        document.getModel().getRoot()
            .addEventListener(OBJECT_CHANGED, (event: ObjectChangedEvent) => {
              this.applicationRef.tick();
            });
      }, (model) => {
        // Do nothing.
      }, (error) => {
        // If the user doesn't have permission to view this uxgraph, just send
        // him back to the home screen.
        if (error.type === FORBIDDEN) {
          // TODO(girum): We can do better than an alert() here...
          alert('You do not have permission to view this uxgraph. ' +
              'Redirecting to the home page...');
          this.router.navigateByUrl('/');
        }
        console.error('Error loading Realtime API: ', error);
      });
    });
  }

  private static dedupe(collaborators: Collaborator[]) {
    let filtered = new Map();
    for (let collaborator of collaborators) {
      filtered.set(collaborator.userId, collaborator);
    }

    let filteredList: Collaborator[] = [];
    filtered.forEach((value: Collaborator) => {
      filteredList.push(value);
    });

    return filteredList;
  }

}
