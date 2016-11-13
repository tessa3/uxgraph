import {Injectable} from '@angular/core';
import {
    Http, URLSearchParams, Response,
    RequestOptions, Headers
} from '@angular/http';
import {AsyncSubject, Observable} from 'rxjs';
import CollaborativeString = gapi.drive.realtime.CollaborativeString;
import {GoogleDriveQueryEncoder} from './google-drive-query-encoder';


const CLIENT_ID = '458941249796-jfvnbelhroiit38vhe5d69av0jjnoi7b.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBcALBUoAgCQ--XxyHjIWW6ifBEyDSck08';

const GOOGLE_APIS_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_APIS_UPLOAD_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_FIELDS_TO_QUERY = 'nextPageToken, files(id, name)';

const UXGRAPH_MIME_TYPE = 'application/vnd.google.drive.ext-type.uxgraph';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
}


@Injectable()
export class GoogleRealtimeService {

  // TODO(girum): This should be a BehaviorSubject instead to handle reconnects.
  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();

  constructor(private http: Http) {
    gapi.load('auth:client,drive-realtime,drive-share', () => {
      this.authorize(false);
    });
  }

  authorize(usePopup: boolean) {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: [
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.file'
      ],
      immediate: !usePopup
    }, (response) => {
      console.log('Authorized: ', response);
      this.oauthToken.next(response);
      this.oauthToken.complete();
    });
  }

  listFiles(): Observable<DriveFile[]> {
    return this.oauthToken.map(oauthToken => {
      let params = new URLSearchParams('', new GoogleDriveQueryEncoder());
      params.set('pageSize', '10');
      params.set('fields', GOOGLE_DRIVE_FIELDS_TO_QUERY);
      params.set('q', 'mimeType = "' + UXGRAPH_MIME_TYPE + '"');

      return this.get(oauthToken.access_token, GOOGLE_APIS_FILES_URL, params)
          .map((response: Response) => {
            console.log(response.json().files);
            return response.json().files;
          });
    }).switch();
  }

  loadRealtimeDocument(driveFileId: string) {
    this.oauthToken.subscribe(() => {
      gapi.drive.realtime.load(driveFileId, (document) => {
        let collaborativeString = document.getModel().getRoot().get('demo_string');
        GoogleRealtimeService.wireTextBoxes(collaborativeString);
      }, (model) => {
        let string = model.createString();
        string.setText('Welcome to uxgraph!');
        model.getRoot().set('demo_string', string);
      }, (error) => {
        console.error('Error loading Realtime API: ', error);
      });
    });
  }

  createFile(name: string): Observable<DriveFile> {
    return this.oauthToken.map(oauthToken => {
      let postBody = {
        name: name,
        mimeType: UXGRAPH_MIME_TYPE
      };

      return this.post(oauthToken.access_token, GOOGLE_APIS_UPLOAD_FILES_URL,
          postBody)
          .map((response: Response) => {
            console.log(response.json());
            return response.json();
          });
    }).switch();
  }

  private get(accessToken: string,
              requestUrl: string,
              urlParams: URLSearchParams): Observable<Response> {
    GoogleRealtimeService.addDefaultUrlParams(urlParams);

    return this.http.get(requestUrl, new RequestOptions({
      headers: GoogleRealtimeService.getDefaultHeaders(accessToken),
      search: urlParams
    }));
  }

  private post(accessToken: string,
               requestUrl: string, body: Object): Observable<Response> {
    let urlParams = new URLSearchParams();
    GoogleRealtimeService.addDefaultUrlParams(urlParams);

    return this.http.post(requestUrl, body, new RequestOptions({
      headers: GoogleRealtimeService.getDefaultHeaders(accessToken),
      search: urlParams
    }));
  }

  private static getDefaultHeaders(accessToken: string): Headers {
    const defaultHeaders = new Headers();
    defaultHeaders.set('Authorization', 'Bearer ' + accessToken);

    return defaultHeaders;
  }

  private static addDefaultUrlParams(params: URLSearchParams): void {
    params.set('key', API_KEY);
  }

  private static wireTextBoxes(collaborativeString: CollaborativeString) {
    let textArea1 = document.getElementById('text_area_1');
    let textArea2 = document.getElementById('text_area_2');
    gapi.drive.realtime.databinding.bindString(collaborativeString, <HTMLInputElement>textArea1);
    gapi.drive.realtime.databinding.bindString(collaborativeString, <HTMLInputElement>textArea2);
  }
}
