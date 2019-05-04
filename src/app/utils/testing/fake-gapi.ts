
class FakeGapiAuth {
  isAuthorized = false;

  authorize(options: any, callback: (response: any) => void) {
    this.isAuthorized = true;

    // Invoke the gapi.auth.authorize() callback as if we were the Gapi client
    // code. The response we send back to our code should *not* have an "error"
    // property since we want to simulate a happy-path authorize() call.
    callback({
      // No "error" property.
    });
  }
}


class FakeGapiDriveRealtimeCustom {

  registeredTypes: string[] = [];
  collaborativeFields: string[] = [];
  initializers: (() => void)[] = [];

  registerType(type: any, typename: string) {
    this.registeredTypes.push(typename);
  }

  collaborativeField(fieldName: string) {
    this.collaborativeFields.push(fieldName);
  }

  setInitializer(type: any, initializerFn: () => void) {
    this.initializers.push(initializerFn);
  }

}

class FakeGapiDriveRealtime {

  custom = new FakeGapiDriveRealtimeCustom();

}

class FakeGapiDrive {

  realtime = new FakeGapiDriveRealtime();

}

export class FakeGapi {

  auth = new FakeGapiAuth();
  drive = new FakeGapiDrive();
  isLoaded = false;

  load(whatToLoad: string, callback: () => void) {
    this.isLoaded = true;
    callback();
  }

}
