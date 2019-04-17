import { Observable } from 'rxjs';

export interface MetadataFile {
  id: string;
  name: string;
}

/**
 * A service to manage storage of the metadata files.
 */
export abstract class MetadataFileService {
  constructor() {}

  abstract getFile(fileId: string): Observable<MetadataFile>|null;
  // Updates the file (as identified by the fileId), and returns the result.
  abstract updateFile(file: MetadataFile): Observable<MetadataFile>|null;
  abstract createFile(): Observable<MetadataFile>;
  abstract listFiles(): Observable<MetadataFile[]>;

  abstract getUserLoggedIn(): Observable<boolean>;
  abstract authorize(showPopup: boolean): void;

  // This probably doesn't belong here.
  abstract openShareDialog(fileId: string): void;

  abstract clearAllFiles(): void;
}
