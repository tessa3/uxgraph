import {Injectable} from '@angular/core';
import {RequestOptionsArgs, Response, ResponseOptions} from '@angular/http';
import {Observable, from} from 'rxjs';

@Injectable()
export class FakeHttp {

  fakeResponse: Response = new Response(new ResponseOptions());

  get(url: string,
      options?: RequestOptionsArgs): Observable<Response> {
    return from([this.fakeResponse]);
  }

  //noinspection JSUnusedGlobalSymbols
  put(url: string,
      body: any,
      options?: RequestOptionsArgs): Observable<Response> {
    return from([this.fakeResponse]);
  }

  //noinspection JSUnusedGlobalSymbols
  patch(url: string,
        body: any,
        options?: RequestOptionsArgs): Observable<Response> {
    return from([this.fakeResponse]);
  }

}
