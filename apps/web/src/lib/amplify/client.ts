"use client";

import { Amplify } from "aws-amplify";

import { amplifyConfig } from "./config";

// Amplify.configure is idempotent and safe to call multiple times; running it at
// module load ensures every client-side call site has Cognito wired up before use.
Amplify.configure(amplifyConfig, { ssr: true });
