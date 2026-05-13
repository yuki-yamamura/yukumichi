"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import clsx from "clsx";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import styles from "./button.module.css";

const button = cva(styles.base, {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: styles.sizeDefault,
      icon: styles.sizeIcon,
      "icon-lg": styles.sizeIconLg,
      "icon-sm": styles.sizeIconSm,
      "icon-xs": styles.sizeIconXs,
      lg: styles.sizeLg,
      sm: styles.sizeSm,
      xs: styles.sizeXs,
    },
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      ghost: styles.ghost,
      link: styles.link,
      outline: styles.outline,
      secondary: styles.secondary,
    },
  },
});

type Props = ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof button>;

export function Button({
  className,
  ref,
  size,
  variant,
  ...props
}: Props & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={clsx(button({ size, variant }), className)}
      {...props}
    />
  );
}
