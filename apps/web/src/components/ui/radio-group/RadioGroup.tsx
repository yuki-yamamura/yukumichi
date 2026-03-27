"use client";

import type { ComponentProps } from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import styles from "./RadioGroup.module.css";

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive> & {
  className?: string;
};

type RadioGroupItemProps = ComponentProps<typeof RadioPrimitive.Root> & {
  className?: string;
};

function RadioGroup({ className, ...props }: RadioGroupProps) {
  const classNames = [styles.group, className].filter(Boolean).join(" ");

  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={classNames}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  const classNames = [styles.item, className].filter(Boolean).join(" ");

  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={classNames}
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
