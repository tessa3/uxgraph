import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { DriveFile } from 'src/app/model';

@Injectable()
export class FakeGoogleRealtimeService {

  currentDocument: BehaviorSubject<Document|null> =
      new BehaviorSubject<Document|null>(null);

  loadRealtimeDocument(driveFileId: string) {
  }

}
