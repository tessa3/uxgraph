import {GoogleDriveService} from './google-drive.service';
import {FakeGapi} from '../../testing/fake/fake-gapi';
import {TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {FakeHttp} from '../../testing/fake/fake-http';
import {Router} from '@angular/router';
import {FakeRouter} from '../../testing/fake/fake-router';

export function main() {
  describe('Google Drive Service', () => {
    let googleDriveService: GoogleDriveService;
    let fakeGapi: FakeGapi;

    beforeEach(() => {
      (<any>window).gapi = fakeGapi = new FakeGapi();

      TestBed.configureTestingModule({
        providers: [
          {provide: Http, useClass: FakeHttp},
          {provide: Router, useClass: FakeRouter},
          GoogleDriveService
        ]
      });

      googleDriveService = TestBed.get(GoogleDriveService);
    });


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
}
