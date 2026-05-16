import { serverEnv } from "@/env/server";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !serverEnv.MOCK_API_ENABLED) {
    return;
  }

  const { server } = await import("@/mock/server");
  server.listen();
}
