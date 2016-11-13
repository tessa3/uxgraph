import {QueryEncoder} from '@angular/http';

export class GoogleDriveQueryEncoder extends QueryEncoder {
  encodeKey(key: string) {
    return encodeURIComponent(key);
  }

  encodeValue(value: string) {
    return encodeURIComponent(value);
  }
}
