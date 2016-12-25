

export class FakeGapi {

  auth = new FakeGapiAuth();
  drive = new FakeGapiDrive();
  isLoaded = false;

  load(whatToLoad:string, callback: () => void) {
    this.isLoaded = true;
    callback();
  }

}

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


class FakeGapiDrive {

  realtime = new FakeGapiDriveRealtime();

}

class FakeGapiDriveRealtime {

  custom = new FakeGapiDriveRealtimeCustom();

}

class FakeGapiDriveRealtimeCustom {

  registeredTypes: string[] = [];
  collaborativeFields: string[] = [];

  registerType(type: any, typename: string) {
    this.registeredTypes.push(typename);
  }

  collaborativeField(fieldName: string) {
    this.collaborativeFields.push(fieldName);
  }

}
