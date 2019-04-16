import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { MetadataFile } from '../../service/metadata-file.service';

@Injectable()
export class FakeGoogleDriveService {

  private file: MetadataFile = {
    name: 'fakeName',
    id: 'chingy'
  };

  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();

  authorize(usePopup: boolean) {}

  listFiles(): Observable<MetadataFile[]> {
    return of([this.file]);
  }

  getFile(fileId: string): Observable<MetadataFile> {
    return of(this.file);
  }

  getUserLoggedIn(): Observable<boolean> {
    return of(false);
  }
}
