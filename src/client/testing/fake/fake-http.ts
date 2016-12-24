import {Injectable} from '@angular/core';
import {RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class FakeHttp {

  fakeResponse: Response;

  get(url: string,
      options?: RequestOptionsArgs): Observable<Response> {
    return Observable.from([this.fakeResponse]);
  }

  //noinspection JSUnusedGlobalSymbols
  put(url: string,
      body: any,
      options?: RequestOptionsArgs): Observable<Response> {
    return Observable.from([this.fakeResponse]);
  }

  //noinspection JSUnusedGlobalSymbols
  patch(url: string,
        body: any,
        options?: RequestOptionsArgs): Observable<Response> {
    return Observable.from([this.fakeResponse]);
  }

}
