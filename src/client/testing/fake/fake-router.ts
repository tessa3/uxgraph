import {Injectable} from '@angular/core';
import {UrlTree, NavigationExtras} from '@angular/router';

@Injectable()
export class FakeRouter {

  navigatedUrl: string|UrlTree;

  //noinspection JSUnusedGlobalSymbols
  navigateByUrl(url: string|UrlTree,
                extras?: NavigationExtras): Promise<boolean> {
    this.navigatedUrl = url;

    return Promise.resolve(true);
  }
}
