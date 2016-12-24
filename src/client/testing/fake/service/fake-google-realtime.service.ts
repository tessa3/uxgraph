import {Injectable} from '@angular/core';
import {GoogleRealtimeService} from '../../../app/service/google-realtime.service';

@Injectable()
export class FakeGoogleRealtimeService extends GoogleRealtimeService {

  realtimeDocumentWasLoaded = false;

  loadRealtimeDocument(driveFileId: string): any {
    this.realtimeDocumentWasLoaded = true;
  }

}
