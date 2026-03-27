"use client";

import type { ComponentProps } from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import clsx from "clsx";
import styles from "./RadioGroup.module.css";

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive> & {
  className?: string;
};

type RadioGroupItemProps = ComponentProps<typeof RadioPrimitive.Root> & {
  className?: string;
};

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={clsx(styles.group, className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
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

export { RadioGroup, RadioGroupItem };
