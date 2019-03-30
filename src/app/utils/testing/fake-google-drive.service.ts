import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { StorageFile } from '../../service/storage.service';

@Injectable()
export class FakeGoogleDriveService {

  private file: StorageFile = {
    name: 'fakeName',
    mimeType: 'fakeMimeType',
    kind: 'fakeKind',
    id: 'chingy'
  };

  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();

  authorize(usePopup: boolean) {}

  listFiles(): Observable<StorageFile[]> {
    return of([this.file]);
  }

  getFile(fileId: string): Observable<StorageFile> {
    return of(this.file);
  }

  getUserLoggedIn(): Observable<boolean> {
    return of(false);
  }
}
