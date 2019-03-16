import {Injectable, NgZone} from '@angular/core';
import {AsyncSubject, Observable} from 'rxjs';
import {
  Http,
  URLSearchParams,
  Response,
  Headers,
  RequestOptions,
  QueryEncoder
} from '@angular/http';
import {Router} from '@angular/router';
import {DriveFile} from '../model/drive-file';
import {Card} from '../model/card';
import {Arrow} from '../model/arrow';
import {map, switchAll} from 'rxjs/operators';


// TODO(eyuelt): move this stuff
const API_KEY = 'AIzaSyBcALBUoAgCQ--XxyHjIWW6ifBEyDSck08';
const CLIENT_ID =
    '458941249796-jfvnbelhroiit38vhe5d69av0jjnoi7b.apps.googleusercontent.com';

const GOOGLE_APIS_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_FIELDS_TO_QUERY = 'nextPageToken, files(id, name)';
const PAGE_SIZE = 10;

const UXGRAPH_MIME_TYPE = 'application/vnd.google.drive.ext-type.uxgraph';


@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  /**
   * The OAuth token that Google gives back for the current client.
   * TODO(girum): This should be a BehaviorSubject instead to handle
   * reconnects.
   */
  oauthToken: AsyncSubject<GoogleApiOAuth2TokenObject> =
      new AsyncSubject<GoogleApiOAuth2TokenObject>();


  constructor(private http: Http,
              private zone: NgZone,
              private router: Router) {
    // Immediately load additional JavaScript code to interact with gapi
    // (gapi = "Google API" for JS).
    gapi.load('auth:client,drive-realtime,drive-share', () => {
      this.zone.run(() => {
        // Once Gapi has downloaded the rest of the client JS code
        // we need to run our app, we're able to register our custom
        // Google Realtime model classes.
        //
        // All custom Realtime model classes must be registered this way.
        Card.registerModel();
        Arrow.registerModel();

        // Also, immediately try to authorize the current user without showing
        // the authorize dialog. May fail if the user has never authorized our
        // app before.
        this.authorize(false);
      });
    });
  }


  /**
   * Attempt to authorize with Google.
   *
   * @param usePopup If true, will show popup on the screen for the user to
   *                 click. If false, will attempt to automatically authenticate
   *                 the user in without showing the popup.
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
      this.zone.run(() => {
        if (usePopup === false && !!response.error) {
          // If auto-login failed, then auto-send the user back to the home
          // screen to manually log back in.
          this.router.navigateByUrl('/');
        }

        // If login worked fine, then save the OAuth token.
        if (!response.error) {
          this.oauthToken.next(response);
          this.oauthToken.complete();
        }
      });
    });
  }


  /**
   * Schedules an HTTP request to Google Drive's /listFiles API endpoint, once
   * RxJS tells us that we have an OAuthToken to use.
   *
   * This method gets us the {@link DriveFile} data for several Drive IDs.
   *
   * Filters for our custom "uxgraph" MIME type.
   */
  listFiles(): Observable<DriveFile[]> {
    return this.oauthToken.pipe(map(oauthToken => {
      let params = new URLSearchParams('', new GoogleDriveQueryEncoder());
      params.set('pageSize', '' + PAGE_SIZE);
      params.set('fields', GOOGLE_DRIVE_FIELDS_TO_QUERY);
      params.set('q', 'mimeType = "' + UXGRAPH_MIME_TYPE + '"');

      return this.get(oauthToken.access_token, GOOGLE_APIS_FILES_URL, params).pipe(
          map((response: Response) => {
            return response.json().files;
          }));
    }), switchAll());
  }

  /**
   * Creates a new Google Drive file. Will be of our custom "uxgraph" MIME type.
   *
   * @param name The (initial) filename for the Google Drive file.
   */
  createFile(name: string): Observable<DriveFile> {
    return this.oauthToken.pipe(map(oauthToken => {
      let postBody = {
        name: name,
        mimeType: UXGRAPH_MIME_TYPE
      };

      return this.post(oauthToken.access_token, GOOGLE_APIS_FILES_URL,
        postBody).pipe(
          map((response: Response) => {
            return response.json();
          }));
    }), switchAll());
  }

  /**
   * Schedules an HTTP request to Google Drive's /files API endpoint, once
   * RxJS tells us that we have an OAuth token to use.
   *
   * This method gets us the {@link DriveFile} data for a single Drive ID.
   */
  getFile(fileId: string): Observable<DriveFile> {
    return this.oauthToken.pipe(map(oauthToken => {
      let params = new URLSearchParams('', new GoogleDriveQueryEncoder());
      const fileUrl = GOOGLE_APIS_FILES_URL + '/' + fileId;

      return this.get(oauthToken.access_token, fileUrl, params).pipe(
          map((response: Response) => {
            return response.json();
          }));
    }), switchAll());
  }


  openShareDialog(fileId: string) {
    return this.oauthToken.subscribe(oauthToken => {
      let shareClient = new gapi.drive.share.ShareClient();
      shareClient.setOAuthToken(oauthToken.access_token);
      shareClient.setItemIds([fileId]);
      shareClient.showSettingsDialog();
    });
  }



  /**
   * Schedules an HTTP PATCH request to Google Drive's /files API endpoint,
   * once RxJS tells us that we have an OAuth token to use.
   *
   * Takes an entire {@link DriveFile} object and updates any fields it sees.
   */
  updateFile(driveFile: DriveFile): Observable<DriveFile> {
    return this.oauthToken.pipe(map(oauthToken => {
      let patchBody = {
        name: driveFile.name
      };

      const fileUrl = GOOGLE_APIS_FILES_URL + '/' + driveFile.id;

      return this.patch(oauthToken.access_token, fileUrl, patchBody).pipe(
          map((response: Response) => {
            return response.json();
          }));
    }), switchAll());
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
    GoogleDriveService.addDefaultUrlParams(urlParams);

    return this.http.get(requestUrl, new RequestOptions({
      headers: GoogleDriveService.getDefaultHeaders(accessToken),
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
               requestUrl: string,
               body: Object): Observable<Response> {
    let urlParams = new URLSearchParams();
    GoogleDriveService.addDefaultUrlParams(urlParams);

    return this.http.post(requestUrl, body, new RequestOptions({
      headers: GoogleDriveService.getDefaultHeaders(accessToken),
      search: urlParams
    }));
  }

  /**
   * Similar to {@code post()} above, but for PATCH requests.
   */
  private patch(accessToken: string,
                requestUrl: string,
                body: Object): Observable<Response> {
    let urlParams = new URLSearchParams();
    GoogleDriveService.addDefaultUrlParams(urlParams);

    return this.http.patch(requestUrl, body, new RequestOptions({
      headers: GoogleDriveService.getDefaultHeaders(accessToken),
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


}



/**
 * A little helper class to correctly encode URL parameters. We need this at
 * the moment to URL-encode our custom MIME type as a URL parameter.
 */
class GoogleDriveQueryEncoder extends QueryEncoder {
  encodeKey(key: string) {
    return encodeURIComponent(key);
  }

  encodeValue(value: string) {
    return encodeURIComponent(value);
  }
}
