// Provides utils for runtime checking.

// Prints an error to the console if the runtime type of the given object is
// not expectedType.
export function typeIs(obj: object, expectedType: string) {
  if (obj.constructor.name !== expectedType) {
    console.error(`Expected type: ${expectedType} but got: ${obj.constructor.name}`);
  }
}
