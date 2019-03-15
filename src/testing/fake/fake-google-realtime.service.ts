import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { DriveFile } from 'src/app/model';

@Injectable()
export class FakeGoogleRealtimeService {

  currentDocument: BehaviorSubject<Document> =
      new BehaviorSubject<Document>(null);

  loadRealtimeDocument(driveFileId: string) {
  }

}
