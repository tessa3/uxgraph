import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class FakeGoogleRealtimeService {

  currentDocument: BehaviorSubject<Document> =
      new BehaviorSubject<Document>(null);

}
