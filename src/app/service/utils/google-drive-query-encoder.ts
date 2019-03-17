import { QueryEncoder } from '@angular/http';

/**
 * A little helper class to correctly encode URL parameters. We need this at
 * the moment to URL-encode our custom MIME type as a URL parameter.
 */
// tslint:disable-next-line:deprecation
export class GoogleDriveQueryEncoder extends QueryEncoder {
  encodeKey(key: string) {
    return encodeURIComponent(key);
  }

  encodeValue(value: string) {
    return encodeURIComponent(value);
  }
}
