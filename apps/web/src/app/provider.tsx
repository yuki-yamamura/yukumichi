"use client";

import type { PropsWithChildren } from "react";

import "@/lib/zod/config";

type Props = PropsWithChildren;

export function Provider({ children }: Props) {
  return <>{children}</>;
}
