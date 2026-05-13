"use client";

import clsx from "clsx";

import type { ComponentProps } from "react";

import styles from "./label.module.css";

type Props = ComponentProps<"label">;

export function Label({ className, ref, ...props }: Props & { ref?: React.Ref<HTMLLabelElement> }) {
  return <label ref={ref} data-slot="label" className={clsx(styles.base, className)} {...props} />;
}
