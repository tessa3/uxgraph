import { UUID } from 'angular2-uuid';

export abstract class CollaborativeObjectModel {
  protected static modelName: string;
  // Collaborative fields
  private _id: string;

  // Set getter for id but no setter to prevent overwriting.
  get id() {
    return this._id;
  }

  // Called once when the collaborative object is first created.
  initializeModel() {
    this._id = UUID.UUID(); //UUID4 (randomized)
  }

  static registerModel() {
    gapi.drive.realtime.custom.registerType(this, this.modelName);
    gapi.drive.realtime.custom.setInitializer(this, this.prototype.initializeModel);
    this.prototype._id = gapi.drive.realtime.custom.collaborativeField('_id');
  }
}
