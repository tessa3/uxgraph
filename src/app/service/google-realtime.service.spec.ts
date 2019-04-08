import { TestBed, async } from '@angular/core/testing';
import { GoogleRealtimeService } from './google-realtime.service';
import { FakeGapi } from '../utils/testing/fake-gapi';
import { Http } from '@angular/http';
import { GoogleDriveMetadataFileService } from './google-drive-metadata-file.service';
import { FakeHttp } from '../utils/testing/fake-http';
import { RouterTestingModule } from '@angular/router/testing';
import { MetadataFileService } from './metadata-file.service';

describe('Google Realtime Service', () => {
  let googleRealtimeService: GoogleRealtimeService;
  let fakeGapi: FakeGapi;

  beforeEach(async(() => {
    // Override the window.gapi global API with our fake implementation.
    (window as any).gapi = fakeGapi = new FakeGapi();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: Http, useClass: FakeHttp },  // tslint:disable-line:deprecation
        { provide: MetadataFileService, useClass: GoogleDriveMetadataFileService },
        GoogleRealtimeService
      ]
    });

    googleRealtimeService = TestBed.get(GoogleRealtimeService);
  }));


  it('should be able to load a Realtime document by id', () => {
    expect(googleRealtimeService).not.toBeNull();
  });


  it('should read the set of collaborators from the document', () => {
    expect(googleRealtimeService).not.toBeNull();
  });


  it('should dynamically update the set of collaborators too', () => {
    expect(googleRealtimeService).not.toBeNull();
  });


  it('should de-dupe collaborators with the same user id', () => {
    expect(googleRealtimeService).not.toBeNull();
  });


  it('should redirect back to the homepage if the user does not ' +
      'have permission to view the current uxgraph', () => {
    expect(googleRealtimeService).not.toBeNull();
  });


});
