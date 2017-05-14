declare namespace gapi.drive.realtime.custom {
  export function collaborativeField(fieldName: string): any;

  export function registerType(
      customCollaborativeType: any,
      typename: string): void;

  export function setInitializer(type: any, initializerFn: () => void): void;
}
