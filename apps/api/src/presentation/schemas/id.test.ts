import { faker } from "@faker-js/faker";

import { SpotId } from "@/domain/spot/models/spot";

import { spotIdExample, spotIdOutputSchema, spotIdParamSchema } from "./id";

describe("spotIdExample", () => {
  it("matches encode(reserved UUIDv7)", () => {
    const reserved = SpotId.parse("00000000-0000-7000-8000-000000000000");

    expect(spotIdOutputSchema.parse(reserved)).toBe(spotIdExample);
  });
});

describe("spotIdOutputSchema", () => {
  it("encodes a SpotId to a 22-character Base62 string", () => {
    const uuid = SpotId.parse(faker.string.uuid({ version: 7 }));

    const base62 = spotIdOutputSchema.parse(uuid);

    expect(base62).toMatch(/^[0-9A-Za-z]{22}$/);
  });

  it("round-trips through spotIdParamSchema", () => {
    const original = SpotId.parse(faker.string.uuid({ version: 7 }));

    const base62 = spotIdOutputSchema.parse(original);
    const decoded = spotIdParamSchema.parse(base62);

    expect(decoded).toBe(original);
  });

  it("encodes the maximum valid UUIDv7 to 22 characters", () => {
    const maxUuidv7 = SpotId.parse("ffffffff-ffff-7fff-bfff-ffffffffffff");

    const base62 = spotIdOutputSchema.parse(maxUuidv7);

    expect(base62).toHaveLength(22);
    expect(spotIdParamSchema.parse(base62)).toBe(maxUuidv7);
  });
});

describe("spotIdParamSchema", () => {
  it("accepts a valid 22-character Base62 string and returns a SpotId", () => {
    const uuid = SpotId.parse(faker.string.uuid({ version: 7 }));
    const base62 = spotIdOutputSchema.parse(uuid);

    const parsed = spotIdParamSchema.parse(base62);

    expect(parsed).toBe(uuid);
  });

  it("rejects a string shorter than 22 characters", () => {
    const result = spotIdParamSchema.safeParse("000000002dwHTRTFRxWLT");

    expect(result.success).toBe(false);
  });

  it("rejects a string longer than 22 characters", () => {
    const result = spotIdParamSchema.safeParse("000000002dwHTRTFRxWLTMA");

    expect(result.success).toBe(false);
  });

  it("rejects a string with characters outside the Base62 alphabet", () => {
    const result = spotIdParamSchema.safeParse("000000002dwHTRTFRxWLT-");

    expect(result.success).toBe(false);
  });

  it("rejects a Base62 string that decodes to a non-UUIDv7 value", () => {
    // "zzzzzzzzzzzzzzzzzzzzzz" decodes to a hex value > 128 bits,
    // which fails SpotId (z.uuidv7()) validation.
    const result = spotIdParamSchema.safeParse("zzzzzzzzzzzzzzzzzzzzzz");

    expect(result.success).toBe(false);
  });

  it("rejects a Base62 string that decodes to a UUIDv4 shape", () => {
    // Encode a UUIDv4 as if it were a UUIDv7 to prove the version check fires.
    const uuidv4 = faker.string.uuid({ version: 4 });
    const n = BigInt("0x" + uuidv4.replaceAll("-", ""));
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let base62 = "";
    let cursor = n;
    while (base62.length < 22) {
      base62 = alphabet[Number(cursor % 62n)] + base62;
      cursor /= 62n;
    }

    const result = spotIdParamSchema.safeParse(base62);

    expect(result.success).toBe(false);
  });
});
