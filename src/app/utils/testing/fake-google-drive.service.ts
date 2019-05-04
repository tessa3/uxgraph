import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { DriveFile } from 'src/app/model';

@Injectable()
export class FakeGoogleDriveService {

  private driveFile: DriveFile = {
    name: 'fakeName',
    mimeType: 'fakeMimeType',
    kind: 'fakeKind',
    id: 'chingy'
  };

  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();

  authorize(usePopup: boolean) {}

  listFiles(): Observable<DriveFile[]> {
    return of([this.driveFile]);
  }

  getFile(fileId: string): Observable<DriveFile> {
    return of(this.driveFile);
  }
}
