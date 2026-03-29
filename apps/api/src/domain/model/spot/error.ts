export type SpotValidationError = { kind: "validation"; message: string };

export type SpotNotFoundError = { kind: "not_found"; message: string };

export type SpotAlreadyArchivedError = { kind: "already_archived"; message: string };
