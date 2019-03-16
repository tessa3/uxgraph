import { TestBed, async } from '@angular/core/testing';
import { GoogleRealtimeService } from './google-realtime.service';
import { FakeGapi } from '../../testing/fake/fake-gapi';
import { Http } from '@angular/http';
import { GoogleDriveService } from './google-drive.service';
import { FakeHttp } from '../../testing/fake/fake-http';
import { RouterTestingModule } from '@angular/router/testing';

describe('Google Realtime Service', () => {
  let googleRealtimeService: GoogleRealtimeService;
  let fakeGapi: FakeGapi;

  beforeEach(async(() => {
    // Override the window.gapi global API with our fake implementation.
    (<any>window).gapi = fakeGapi = new FakeGapi();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: Http, useClass: FakeHttp},
        GoogleDriveService,
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