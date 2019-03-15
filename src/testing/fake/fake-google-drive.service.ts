import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriveFile } from 'src/app/model';

@Injectable()
export class FakeGoogleDriveService {

  oauthToken: BehaviorSubject<GoogleApiOAuth2TokenObject> =
      new BehaviorSubject<GoogleApiOAuth2TokenObject>(null);

  authorize(usePopup: boolean) {}

  listFiles(): Observable<DriveFile[]> {
    return new Observable<DriveFile[]>(null);
  }

  getFile(fileId: string): Observable<DriveFile> {
    return new Observable<DriveFile>(null);
  }
}
