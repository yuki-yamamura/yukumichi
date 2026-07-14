"use client";

import type { PropsWithChildren } from "react";

import "@/lib/amplify/client";
import "@/lib/zod/config";

type Props = PropsWithChildren;

export function Provider({ children }: Props) {
  return <>{children}</>;
}
