/**
 * Old-school function "classes". As far as I can tell, this is the only way
 * to get the Google Realtime API to work with custom classes.
 *
 * Oh well.
 *
 * @constructor
 */
export const Card = function() {
  // Do nothing.
};

/**
 * Gapi lazy-downloads all of its JS client code after the app has been loaded.
 * We call "gapi.load()" to do this.
 *
 * For this reason, we can't immediately register our custom Google Realtime
 * model classes. We can only register them after the rest of the Gapi JS
 * client code has been downloaded.
 *
 * As a workaround, we'll have to call functions to register our custom
 * Google Realtime model classes *after* the Gapi JS client code is downloaded.
 *
 *
 * All custom Google Realtime model classes must be registered this way.
 */
export const registerCardModel = function() {
  gapi.drive.realtime.custom.registerType(Card, 'Card');
  Card.prototype.x =
      gapi.drive.realtime.custom.collaborativeField('x');
  Card.prototype.y =
      gapi.drive.realtime.custom.collaborativeField('y');
  Card.prototype.text =
      gapi.drive.realtime.custom.collaborativeField('text');
  Card.prototype.selected =
      gapi.drive.realtime.custom.collaborativeField('selected');
};
