export function mustFind<T, S extends T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => value is S,
): S;

export function mustFind<T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => boolean,
): T;

export function mustFind<T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => unknown,
): T {
  // eslint-disable-next-line unicorn/no-array-callback-reference -- Allow type assertion only for helper functions.
  const item = array.find(callbackFn);
  if (!item) {
    throw new Error("No item found");
  }

  return item;
}
