import z from "zod";

import { SpotId } from "@/domain/spot/models/spot";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base62Length = 22;

function encode(uuid: string): string {
  let n = BigInt("0x" + uuid.replaceAll("-", ""));
  let out = "";
  while (out.length < base62Length) {
    out = alphabet[Number(n % 62n)] + out;
    n /= 62n;
  }

  return out;
}

function decode(base62: string): string {
  let n = 0n;
  for (const c of base62) n = n * 62n + BigInt(alphabet.indexOf(c));
  const hex = n.toString(16).padStart(32, "0");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// encode("00000000-0000-7000-8000-000000000000") — reserved UUIDv7 (timestamp=0, variant=10xx, rand=0)
export const spotIdExample = "000000002dwHTRTFRxWLTM";

const meta = {
  description: "Spot ID (Base62-encoded UUIDv7, 22 characters)",
  example: spotIdExample,
};

export const spotIdParamSchema = z
  .string()
  .regex(/^[0-9A-Za-z]{22}$/)
  .transform(decode)
  .pipe(SpotId)
  .meta(meta);

export const spotIdOutputSchema = SpotId.transform(encode).meta(meta);
