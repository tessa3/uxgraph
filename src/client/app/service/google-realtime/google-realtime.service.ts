import {Injectable} from '@angular/core';
import {
    Http, URLSearchParams, Response,
    RequestOptions, Headers, QueryEncoder
} from '@angular/http';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Observable} from 'rxjs/Observable';
import CollaborativeString = gapi.drive.realtime.CollaborativeString;
import 'rxjs/add/operator/switch';


const API_KEY = 'AIzaSyBcALBUoAgCQ--XxyHjIWW6ifBEyDSck08';
const CLIENT_ID =
    '458941249796-jfvnbelhroiit38vhe5d69av0jjnoi7b.apps.googleusercontent.com';


const GOOGLE_APIS_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_FIELDS_TO_QUERY = 'nextPageToken, files(id, name)';
const PAGE_SIZE = 10;

const UXGRAPH_MIME_TYPE = 'application/vnd.google.drive.ext-type.uxgraph';


/**
 * Represents a single Google Drive file.
 *
 * This object is just metadata for the file. Data for the file is stored in
 * the Realtime Document.
 *
 * TODO(girum): Create an ngrx/store domain layer that automatically implements
 * Realtime Document manipulation.
 */
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
}

/**
 * A service to authenticate and interact with Google's Realtime API.
 * Includes Google Drive API interaction.
 */
@Injectable()
export class GoogleRealtimeService {

  /**
   * The OAuth token that Google gives back for the current client.
   * TODO(girum): This should be a BehaviorSubject instead to handle reconnects.
   *
   * @type {AsyncSubject<GoogleApiOAuth2TokenObject>}
   */
  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();

  constructor(private http: Http) {
    // Immediately load additional JavaScript code to interact with gapi
    // (gapi = "Google API" for JS).
    gapi.load('auth:client,drive-realtime,drive-share', () => {
      this.authorize(false);
    });
  }

  /**
   * Attempt to authorize with Google.
   *
   * @param usePopup If true, will show popup on the screen for the user to
   *                 click. If false, will attempt to automatically authenticate
   *                 the user in without showing him the popup.
   */
  authorize(usePopup: boolean) {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: [
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.file'
      ],
      immediate: !usePopup
    }, (response) => {
      this.oauthToken.next(response);
      this.oauthToken.complete();
    });
  }

  /**
   * Schedules an HTTP request to Google Drive's /listFiles API endpoint, once
   * RxJS tells us that we have an OAuthToken to use.
   *
   * Filters for our custom "uxgraph" MIME type.
   */
  listFiles(): Observable<DriveFile[]> {
    return this.oauthToken.map(oauthToken => {
      let params = new URLSearchParams('', new GoogleDriveQueryEncoder());
      params.set('pageSize', '' + PAGE_SIZE);
      params.set('fields', GOOGLE_DRIVE_FIELDS_TO_QUERY);
      params.set('q', 'mimeType = "' + UXGRAPH_MIME_TYPE + '"');

      return this.get(oauthToken.access_token, GOOGLE_APIS_FILES_URL, params)
          .map((response: Response) => {
            return response.json().files;
          });
    }).switch();
  }

  /**
   * Loads the Realtime-version of a Google Drive file by Id.
   * Again, this code will automatically run anytime this.oauthToken changes
   * according to RxJS.
   *
   * @param driveFileId The ID of the Google Drive file you'd like to load
   *                    Realtime for.
   */
  loadRealtimeDocument(driveFileId: string) {
    this.oauthToken.subscribe(() => {
      gapi.drive.realtime.load(driveFileId, (document) => {
        let collaborativeString =
            document.getModel().getRoot().get('demo_string');
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

  /**
   * Creates a new Google Drive file. Will be of our custom "uxgraph" MIME type.
   *
   * @param name The (initial) filename for the Google Drive file.
   */
  createFile(name: string): Observable<DriveFile> {
    return this.oauthToken.map(oauthToken => {
      let postBody = {
        name: name,
        mimeType: UXGRAPH_MIME_TYPE
      };

      return this.post(oauthToken.access_token, GOOGLE_APIS_FILES_URL,
          postBody)
          .map((response: Response) => {
            return response.json();
          });
    }).switch();
  }

  /**
   * A little private helper for sending HTTP GET requests via Angular's HTTP
   * service.
   *
   * This method automatically puts in a few HTTP headers and query params.
   */
  private get(accessToken: string,
              requestUrl: string,
              urlParams: URLSearchParams): Observable<Response> {
    GoogleRealtimeService.addDefaultUrlParams(urlParams);

    return this.http.get(requestUrl, new RequestOptions({
      headers: GoogleRealtimeService.getDefaultHeaders(accessToken),
      search: urlParams
    }));
  }

  /**
   * A little private helper for sending HTTP POST requests via Angular's HTTP
   * service.
   *
   * This method automatically puts in a few HTTP headers and query params.
   */
  private post(accessToken: string,
               requestUrl: string, body: Object): Observable<Response> {
    let urlParams = new URLSearchParams();
    GoogleRealtimeService.addDefaultUrlParams(urlParams);

    return this.http.post(requestUrl, body, new RequestOptions({
      headers: GoogleRealtimeService.getDefaultHeaders(accessToken),
      search: urlParams
    }));
  }

  /**
   * Creates and returns a set of default headers that go up with every HTTP
   * request.
   * @param accessToken Access token pulled from the
   *                    {@link GoogleApiOAuth2TokenObject} we have on hand.
   * @returns {Headers} HTTP headers, in Angular's HTTP service object type.
   */
  private static getDefaultHeaders(accessToken: string): Headers {
    const defaultHeaders = new Headers();
    defaultHeaders.set('Authorization', 'Bearer ' + accessToken);

    return defaultHeaders;
  }

  /**
   * Takes some URL params and adds some more, default URL params that should
   * go up with every request.
   */
  private static addDefaultUrlParams(params: URLSearchParams) {
    params.set('key', API_KEY);
  }

  /**
   * Temporary, hacky code ripped straight from Google's Realtime API tutorial.
   *
   * TODO(girum): Delete me once we wire up Realtime to ngrx/store.
   */
  private static wireTextBoxes(collaborativeString: CollaborativeString) {
    let textArea1 = document.getElementById('text_area_1');
    let textArea2 = document.getElementById('text_area_2');
    gapi.drive.realtime.databinding
        .bindString(collaborativeString, <HTMLInputElement>textArea1);
    gapi.drive.realtime.databinding
        .bindString(collaborativeString, <HTMLInputElement>textArea2);
  }
}

/**
 * A little helper class to correctly encode URL parameters. We need this at
 * the moment to URL-encode our custom MIME type as a URL parameter.
 */
export class GoogleDriveQueryEncoder extends QueryEncoder {
  encodeKey(key: string) {
    return encodeURIComponent(key);
  }

  encodeValue(value: string) {
    return encodeURIComponent(value);
  }
}
