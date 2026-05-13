"use client";

import clsx from "clsx";

import type { ComponentProps } from "react";

import styles from "./textarea.module.css";

type Props = ComponentProps<"textarea">;

export function Textarea({
  className,
  ref,
  ...props
}: Props & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return (
    <textarea ref={ref} data-slot="textarea" className={clsx(styles.base, className)} {...props} />
  );
}
