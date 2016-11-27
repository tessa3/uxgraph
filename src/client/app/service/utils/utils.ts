import {Injectable} from '@angular/core';

@Injectable()
export class Utils {
  // Returns whether the given mouse event was initiated by the primary button
  static eventIsFromPrimaryButton(event: MouseEvent) {
    return event.which === 1;
  }
}
