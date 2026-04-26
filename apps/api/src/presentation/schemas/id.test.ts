import { faker } from "@faker-js/faker";

import { base62Decode, base62Encode } from "./id";

describe("base62Encode", () => {
  it("encodes a UUIDv7 to a 22-character Base62 string", () => {
    // Given
    const uuid = faker.string.uuid({ version: 7 });

    // When
    const result = base62Encode(uuid);

    // Then
    expect(result).toMatch(/^[0-9A-Za-z]{22}$/);
  });
});

describe("base62Decode", () => {
  it("decodes a 22-character Base62 string to the original UUIDv7", () => {
    // Given
    const uuid = faker.string.uuid({ version: 7 });
    const base62 = base62Encode(uuid);

    // When
    const result = base62Decode(base62);

    // Then
    expect(result).toBe(uuid);
  });
});
