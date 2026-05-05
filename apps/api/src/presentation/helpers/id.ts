import { alphabet } from "@/presentation/schemas/id";

/**
 * Encodes a UUIDv7 string into a 22-character Base62 string.
 * @param uuid A UUIDv7 string
 * @returns A 22-character Base62 string encoding the input UUIDv7
 */

export function base62Encode(uuid: string): string {
  let n = BigInt("0x" + uuid.replaceAll("-", ""));
  let out = "";

  const base62Length = 22;
  while (out.length < base62Length) {
    // Get the rightmost Base62 digit, prepend it to the output, and shift n right by one Base62 digit.
    const char = alphabet[Number(n % 62n)];
    out = char + out;
    n /= 62n;
  }

  return out;
} /**
 * Decodes a 22-character Base62 string into a UUIDv7 string.
 * @param base62 A 22-character Base62 string encoding a UUIDv7
 * @returns The UUIDv7 string decoded from the input Base62 string
 */

export function base62Decode(base62: string): string {
  let n = 0n;

  // For each Base62 digit, shift n left by one Base62 digit and add the value of the digit.
  for (const char of base62) {
    n = n * 62n + BigInt(alphabet.indexOf(char));
  }
  const hex = n.toString(16).padStart(32, "0");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
