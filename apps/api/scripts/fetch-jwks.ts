import "dotenv/config";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUTPUT_PATH = "src/infrastructure/auth/cognito-jwks.json";

const region = process.env.AWS_REGION;
const userPoolId = process.env.COGNITO_USER_POOL_ID;

if (!region || !userPoolId) {
  console.warn(
    "AWS_REGION or COGNITO_USER_POOL_ID not set; skipping JWKS refresh (using the committed cognito-jwks.json).",
  );
} else {
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch JWKS from ${url}: ${String(response.status)} ${response.statusText}`,
    );
  }

  const jwks = await response.json();

  mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(jwks, null, 2)}\n`);

  console.warn(`JWKS written to ${OUTPUT_PATH}`);
}
