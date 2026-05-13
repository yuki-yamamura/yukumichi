export type Result<T, E> = Err<E> | Ok<T>;

export type Ok<T> = {
  readonly isErr: false;
  readonly isOk: true;
  readonly value: T;
};

export type Err<E> = {
  readonly error: E;
  readonly isErr: true;
  readonly isOk: false;
};

export function ok<T>(value: T): Ok<T> {
  return { isErr: false, isOk: true, value };
}

export function err<E>(error: E): Err<E> {
  return { error, isErr: true, isOk: false };
}
