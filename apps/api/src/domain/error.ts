export type ConflictError = { kind: "conflict"; message: string };

export type DataIntegrityError = { kind: "data_integrity"; message: string };

export type NotFoundError = { kind: "not_found"; message: string };

export type ValidationError = { kind: "validation"; message: string };
