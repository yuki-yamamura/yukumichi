import type { ComponentProps } from "react";
import styles from "./button.module.css";

type Variant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
type Size = "default" | "sm" | "lg" | "icon";

type Props = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  default: styles.variantDefault,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  destructive: styles.variantDestructive,
  secondary: styles.variantSecondary,
  link: styles.variantLink,
};

const sizeClass: Record<Size, string> = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
};

export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: Props) {
  const classNames = [
    styles.button,
    variantClass[variant],
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
}
