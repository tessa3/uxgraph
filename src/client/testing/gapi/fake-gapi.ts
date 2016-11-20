

export class FakeGapi {

  auth = new FakeGapiAuth();
  isLoaded = false;

  load(whatToLoad:string, callback: () => void) {
    this.isLoaded = true;
    callback();
  }

}

class FakeGapiAuth {
  isAuthorized = false;

  authorize(options: any, callback: () => void) {
    this.isAuthorized = true;
    callback();
  }
}
