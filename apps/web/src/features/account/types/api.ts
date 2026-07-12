import type { fetchClient } from "@/lib/hono/client";
import type { InferRequestType } from "hono";

export type SignUpRequest = InferRequestType<(typeof fetchClient)["accounts"]["sign-up"]["$post"]>;

export type ConfirmSignUpRequest = InferRequestType<
  (typeof fetchClient)["accounts"]["sign-up"]["confirm"]["$post"]
>;
