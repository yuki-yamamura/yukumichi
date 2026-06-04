export type SpotDuplicatedError = { kind: "SPOT_DUPLICATED"; message: string };

export type DataIntegrityError = { kind: "DATA_INTEGRITY"; message: string };

export type NotFoundError = { kind: "NOT_FOUND"; message: string };

export type ValidationError = { kind: "VALIDATION"; message: string };

export type DatabaseError = { kind: "DATABASE"; message: string };
