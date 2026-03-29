"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import clsx from "clsx";

import type { ComponentProps } from "react";

import styles from "./index.module.css";

type Props = ComponentProps<typeof InputPrimitive>;

export function Input({ className, ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <InputPrimitive
      ref={ref}
      data-slot="input"
      className={clsx(styles.base, className)}
      {...props}
    />
  );
}
