"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import clsx from "clsx";

import type { ComponentProps } from "react";

import styles from "./radio-group.module.css";

type RootProps = ComponentProps<typeof RadioGroupPrimitive> & {
  className?: string;
};

type ItemProps = ComponentProps<typeof RadioPrimitive.Root> & {
  className?: string;
};

export function Root({ className, ...props }: RootProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={clsx(styles.base, className)}
      {...props}
    />
  );
}

export function Item({ className, ...props }: ItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={clsx(styles.item, className)}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={styles.indicator}
      >
        <span className={styles.indicatorIcon} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
