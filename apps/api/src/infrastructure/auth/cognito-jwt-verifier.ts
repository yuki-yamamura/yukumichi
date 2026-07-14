import { CognitoJwtVerifier } from "aws-jwt-verify";

import cognitoJwks from "./cognito-jwks.json";

type CognitoJwtVerifierConfig = {
  clientId: string;
  userPoolId: string;
};

export function createCognitoJwtVerifier({ clientId, userPoolId }: CognitoJwtVerifierConfig) {
  // The verifier caches JWKS in memory, so we hand it the bundled JWKS at construction
  // time. That keeps everything synchronous later and avoids any outbound network from
  // the Lambda, which has no route out to the Cognito endpoint.
  const verifier = CognitoJwtVerifier.create({
    clientId,
    tokenUse: "id",
    userPoolId,
  });
  verifier.cacheJwks(cognitoJwks);

  return verifier;
}
