import { UUID } from 'angular2-uuid';

export abstract class CollaborativeObjectModel {
  protected static modelName: string;
  // Collaborative fields
  // TODO(eyuelt): get rid of non-null assertions
  private internalId!: string;

  // Provide getter for id but no setter to prevent overwriting.
  get id() {
    return this.internalId;
  }

  static registerModel() {
    gapi.drive.realtime.custom.registerType(this, this.modelName);
    gapi.drive.realtime.custom.setInitializer(this, this.prototype.initializeModel);
    this.prototype.internalId = gapi.drive.realtime.custom.collaborativeField('_id');
  }

  // Called once when the collaborative object is first created.
  initializeModel() {
    this.internalId = UUID.UUID();  // UUID4 (randomized)
  }
}
