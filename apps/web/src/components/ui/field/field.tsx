"use client";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useMemo } from "react";

import { Label } from "@/components/ui/label";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import styles from "./field.module.css";

function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={clsx(styles.fieldSet, className)} {...props} />;
}

type FieldLegendProps = ComponentProps<"legend"> & {
  variant?: "label" | "legend";
};

function FieldLegend({ className, variant = "legend", ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={clsx(styles.fieldLegend, className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field-group" className={clsx(styles.fieldGroup, className)} {...props} />;
}

const field = cva(styles.field, {
  defaultVariants: {
    orientation: "vertical",
  },
  variants: {
    orientation: {
      horizontal: styles.orientationHorizontal,
      responsive: styles.orientationResponsive,
      vertical: styles.orientationVertical,
    },
  },
});

type FieldProps = ComponentProps<"div"> & VariantProps<typeof field>;

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={clsx(field({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="field-content" className={clsx(styles.fieldContent, className)} {...props} />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label data-slot="field-label" className={clsx(styles.fieldLabel, className)} {...props} />
  );
}

function FieldTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field-label" className={clsx(styles.fieldTitle, className)} {...props} />;
}

function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={clsx(styles.fieldDescription, className)}
      {...props}
    />
  );
}

type FieldSeparatorProps = ComponentProps<"div"> & {
  children?: React.ReactNode;
};

function FieldSeparator({ children, className, ...props }: FieldSeparatorProps) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={clsx(styles.fieldSeparator, className)}
      {...props}
    >
      <div className={styles.fieldSeparatorLine} />
      {children && (
        <span data-slot="field-separator-content" className={styles.fieldSeparatorContent}>
          {children}
        </span>
      )}
    </div>
  );
}

type FieldErrorProps = ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
};

function FieldError({ children, className, errors, ...props }: FieldErrorProps) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className={styles.fieldErrorList}>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={clsx(styles.fieldError, className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
