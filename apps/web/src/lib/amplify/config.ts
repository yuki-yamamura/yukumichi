import { clientEnv } from "@/env/client";

import type { ResourcesConfig } from "aws-amplify";

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: clientEnv.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      userPoolId: clientEnv.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    },
  },
};
