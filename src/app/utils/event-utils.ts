export class EventUtils {
  // Returns whether the given mouse event was initiated by the primary button
  static eventIsFromPrimaryButton(event: MouseEvent) {
    return event.button === 0;
  }
}
