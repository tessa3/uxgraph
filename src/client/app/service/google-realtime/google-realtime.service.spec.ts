// import {GoogleRealtimeService} from './google-realtime.service';
// import {
//   Http, RequestOptions
// } from '@angular/http';
// import {MockBackend} from '@angular/http/testing/mock_backend';
// import {FakeGapi} from '../../../testing/gapi/fake-gapi';

export function main() {
  // describe('Google Realtime Service', () => {
  //   let googleRealtimeService: GoogleRealtimeService;
  //   let fakeGapi: FakeGapi;
  //
  //   beforeEach(() => {
  //     (<any>window).gapi = fakeGapi = new FakeGapi();
  //
  //     let injector = ReflectiveInjector.resolveAndCreate([
  //       disableDeprecatedForms(),
  //       provideForms(),
  //       HTTP_PROVIDERS,
  //       GoogleRealtimeService,
  //       BaseRequestOptions,
  //       MockBackend,
  //       provide(Http, {
  //         useFactory: function(backend: ConnectionBackend,
  //                              defaultOptions: BaseRequestOptions) {
  //           return new Http(backend, defaultOptions);
  //         },
  //         deps: [MockBackend, BaseRequestOptions]
  //       }),
  //     ]);
  //
  //     googleRealtimeService = injector.get(GoogleRealtimeService);
  //   });
  //
  //
  //   it('should authorize with a popup', () => {
  //     let mockHttp = new Http(new MockBackend(), new RequestOptions());
  //     googleRealtimeService = new GoogleRealtimeService(mockHttp);
  //
  //     // Authorization without popup already happens in the constructor!
  //     expect(fakeGapi.isLoaded).toBe(true);
  //     expect(fakeGapi.auth.isAuthorized).toBe(true);
  //
  //     googleRealtimeService.authorize(true);
  //
  //     // Should still be authorized.
  //     expect(fakeGapi.auth.isAuthorized).toBe(true);
  //   });
  //
  //
  //   // it('should authorize without a popup', () => {
  //   //   let mockHttp = new Http(new MockBackend(), new RequestOptions());
  //   //   googleRealtimeService = new GoogleRealtimeService(mockHttp);
  //   //
  //   //   // Authorization without popup already happens in the constructor!
  //   //   expect(fakeGapi.isLoaded).toBe(true);
  //   //   expect(fakeGapi.auth.isAuthorized).toBe(true);
  //   //
  //   //   googleRealtimeService.authorize(false);
  //   //
  //   //   // Should still be authorized.
  //   //   expect(fakeGapi.auth.isAuthorized).toBe(true);
  //   // });
  //
  //
  //   it('should filter out files for MIME type uxgraph', () => {
  //      expect(googleRealtimeService).not.toBeNull();
  //   });
  //
  //
  //   it('should load the Realtime Model', () => {
  //     expect(googleRealtimeService).not.toBeNull();
  //   });
  //
  //
  //   it('should create files on Google Drive of MIME type uxgraph', () => {
  //     expect(googleRealtimeService).not.toBeNull();
  //   });
  //
  // });
}
