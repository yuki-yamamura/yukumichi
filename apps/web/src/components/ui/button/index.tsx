"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import clsx from "clsx";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import styles from "./index.module.css";

const button = cva(styles.base, {
  variants: {
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
    },
    size: {
      default: styles.sizeDefault,
      xs: styles.sizeXs,
      sm: styles.sizeSm,
      lg: styles.sizeLg,
      icon: styles.sizeIcon,
      "icon-xs": styles.sizeIconXs,
      "icon-sm": styles.sizeIconSm,
      "icon-lg": styles.sizeIconLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type Props = ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof button>;

export function Button({
  className,
  variant,
  size,
  ref,
  ...props
}: Props & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={clsx(button({ variant, size }), className)}
      {...props}
    />
  );
}
