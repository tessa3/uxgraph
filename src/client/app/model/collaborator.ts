/**
 * Not sure if we need this yet. Seems like the transpiled JS is looking for
 * an actual property called "gapi.drive.realtime.Collaborator" instead of
 * just using the imported TypeScript interface at compile time...
 * TODO(girum): Move me to manual_typings?
 */
export interface Collaborator {
  // The HTML color associated with this collaborator.
  // When possible, collaborators are assigned unique colors.
  color: string;

  // The display name for this collaborator.
  displayName: string;

  // True if this collaborator is anonymous, false otherwise.
  isAnonymous: boolean;

  // True if this collaborator is the local user, false otherwise.
  isMe: boolean;

  // The permission ID for this collaborator. This ID is stable for a given
  // user and is compatible with the Drive API permissions APIs.
  // Use the userId property for all other uses.
  permissionId: string;

  // A URL that points to the profile photo for this collaborator, or to a
  // generic profile photo for anonymous collaborators.
  photoUrl: string;

  // The session ID for this collaborator. A single user may have multiple
  // sessions if they have the same document open on multiple devices or in
  // multiple browser tabs.
  sessionId: string;

  // The user ID for this collaborator. This ID is stable for a given user
  // and is compatible with most Google APIs except the Drive API permission
  // APIs. For an ID which is compatible with the Drive API permission APIs,
  // use the permissionId property.
  userId: string;
}
