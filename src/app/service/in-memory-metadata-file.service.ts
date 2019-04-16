import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MetadataFileService, MetadataFile } from './metadata-file.service';

// TODO
export class InMemoryFile implements MetadataFile {
  static counter = 0;
  id: string;
  name: string;

  constructor(name: string) {
    this.id = `${InMemoryFile.counter++}`;
    this.name = name;
  }
}

@Injectable()
export class InMemoryMetadataFileService extends MetadataFileService {

  files: BehaviorSubject<MetadataFile>[] = [];

  listObs = new BehaviorSubject<MetadataFile[]>([]);
  userLoggedInObs: Observable<boolean> = of(true);

  constructor() {
    super();
  }

  // @override
  createFile(): Observable<MetadataFile> {
    const file = new BehaviorSubject(new InMemoryFile('Untitled'));
    this.files.push(file);
    this.listObs.next(this.files.map((fileObs) => fileObs.value));
    return file;
  }

  // @override
  getFile(fileId: string): BehaviorSubject<MetadataFile>|null {
    const file = this.files.find((fileObs) => fileObs.value.id === fileId);
    if (file !== undefined) {
      return file;
    }
    return null;
  }

  // @override
  updateFile(file: MetadataFile): BehaviorSubject<MetadataFile>|null {
    const obs = this.getFile(file.id);
    if (obs !== null) {
      obs.next(file);
    }
    return obs;
  }

  // @override
  listFiles(): Observable<MetadataFile[]> {
    return this.listObs;
  }

  // @override
  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedInObs;
  }

  // @override
  authorize(showPopup: boolean): void {
    // do nothing
  }

  // @override
  openShareDialog(fileId: string): void {
    // do nothing
  }
}
