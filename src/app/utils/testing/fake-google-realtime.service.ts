import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class FakeGoogleRealtimeService {

  currentDocument: BehaviorSubject<Document|null> =
      new BehaviorSubject<Document|null>(null);

  loadRealtimeDocument(driveFileId: string) {
  }

}
