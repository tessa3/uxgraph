import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriveFile } from '../model/drive-file';

export type StorageFile = DriveFile;

/**
 * A service to manage storage of the documents.
 */
@Injectable()
export abstract class StorageService {
  constructor() {}

  abstract getFile(fileId: string): Observable<StorageFile>;
  // Updates the file (as identified by the fileId), and returns the result.
  abstract updateFile(file: StorageFile): Observable<StorageFile>;
  abstract createFile(fileName: string): Observable<StorageFile>;
  abstract listFiles(): Observable<StorageFile[]>;

  abstract getUserLoggedIn(): Observable<boolean>;
  abstract authorize(showPopup: boolean): void;

  // This probably doesn't belong here.
  abstract openShareDialog(fileId: string): void;
}
