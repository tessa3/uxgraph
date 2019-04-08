import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriveFile } from '../model/drive-file';

export type MetadataFile = DriveFile;

/**
 * A service to manage storage of the metadata files.
 */
@Injectable()
export abstract class MetadataFileService {
  constructor() {}

  abstract getFile(fileId: string): Observable<MetadataFile>;
  // Updates the file (as identified by the fileId), and returns the result.
  abstract updateFile(file: MetadataFile): Observable<MetadataFile>;
  abstract createFile(fileName: string): Observable<MetadataFile>;
  abstract listFiles(): Observable<MetadataFile[]>;

  abstract getUserLoggedIn(): Observable<boolean>;
  abstract authorize(showPopup: boolean): void;

  // This probably doesn't belong here.
  abstract openShareDialog(fileId: string): void;
}
