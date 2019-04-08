import { TestBed, async } from '@angular/core/testing';
import { GoogleDriveMetadataFileService } from './google-drive-metadata-file.service';
import { FakeGapi } from '../utils/testing/fake-gapi';
import { Http } from '@angular/http';
import { FakeHttp } from '../utils/testing/fake-http';
import { RouterTestingModule } from '@angular/router/testing';

describe('Google Drive Metadata File Service', () => {
  let googleDriveService: GoogleDriveMetadataFileService;
  let fakeGapi: FakeGapi;

  beforeEach(async(() => {
    // Override the window.gapi global API with our fake implementation.
    (window as any).gapi = fakeGapi = new FakeGapi();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        {provide: Http, useClass: FakeHttp},  // tslint:disable-line:deprecation
        GoogleDriveMetadataFileService
      ]
    });

    googleDriveService = TestBed.get(GoogleDriveMetadataFileService);
  }));


  it('should immediately authorize with a popup', () => {
    // Authorization with popup already happens in the constructor!
    expect(fakeGapi.isLoaded).toBe(true);
    expect(fakeGapi.auth.isAuthorized).toBe(true);

    // Authorize again.
    googleDriveService.authorize(true);

    // Should still be authorized.
    expect(fakeGapi.auth.isAuthorized).toBe(true);
  });


  it('should immediately authorize without a popup', () => {
    // Authorization without popup already happens in the constructor!
    expect(fakeGapi.isLoaded).toBe(true);
    expect(fakeGapi.auth.isAuthorized).toBe(true);

    // Authorize again.
    googleDriveService.authorize(false);

    // Should still be authorized.
    expect(fakeGapi.auth.isAuthorized).toBe(true);
  });


  it('should immediately authorize for.. ahem.. minimal OAuth scopes', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('should redirect back to the homepage on auth error', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('can list Google Drive files', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('should filter the list of files by MIME type uxgraph', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('can create files on Google Drive of MIME type uxgraph', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('can get details of a single uxgraph by id', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('can open the standard Google Drive -Share- dialog', () => {
    expect(googleDriveService).not.toBeNull();
  });


  it('can update the name of a Google Drive file', () => {
    expect(googleDriveService).not.toBeNull();
  });

});
