/**
 * Old-school function "classes". As far as I can tell, this is the only way
 * to get the Google Realtime API to work with custom classes.
 *
 * Oh well.
 *
 * @constructor
 */
export const Arrow = function() {
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
export const registerArrowModel = function() {
  gapi.drive.realtime.custom.registerType(Arrow, 'Arrow');
  /*
   * TODO(eyuelt): change arrow/card movement logic to use the following:
   * Positioning the arrow is primarily done with tailPosition and tipPosition.
   * The associated cards are stored in fromCardId and toCardId. If tailPosition
   * or tipPosition is empty, the positions may be computed from fromCardId and
   * toCardId.
   */
  Arrow.prototype.tailPosition =
      gapi.drive.realtime.custom.collaborativeField('tailPosition');
  Arrow.prototype.tipPosition =
      gapi.drive.realtime.custom.collaborativeField('tipPosition');
  Arrow.prototype.fromCardId =
      gapi.drive.realtime.custom.collaborativeField('fromCardId');
  Arrow.prototype.toCardId =
      gapi.drive.realtime.custom.collaborativeField('toCardId');
};
