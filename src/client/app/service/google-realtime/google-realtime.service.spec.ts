import {ReflectiveInjector} from '@angular/core';
import {GoogleRealtimeService} from './google-realtime.service';
export function main() {
  describe('Google Realtime Service', () => {
    let googleRealtimeService: GoogleRealtimeService;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([]);

      googleRealtimeService = injector.get(GoogleRealtimeService);
    });


    describe('Authorization', () => {
      it('should authorize with a popup', () => {
        expect(googleRealtimeService).not.toBeNull();
      });

      it('should authorize without a popup', () => {

      });
    });


    describe('/ListFiles', () => {
      it('should filter out files for MIME type uxgraph', () => {

      });
    });


    describe('Realtime', () => {
      it('should load the Realtime Model', () => {

      });
    });


    describe('/CreateFile', () => {
      it('should create files on Google Drive of MIME type uxgraph', () => {

      });
    });

  });
}
