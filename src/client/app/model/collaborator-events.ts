export interface CollaboratorEvent {
  /** The collaborator that joined/left. */
  collaborator: gapi.drive.realtime.Collaborator;

  /** The Realtime document that initiated this event. */
  target: gapi.drive.realtime.Document;

  /** The type of the event. */
  type: string;
}
