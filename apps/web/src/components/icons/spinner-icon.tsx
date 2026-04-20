import { CircleNotchIcon } from "@phosphor-icons/react/ssr";

import styles from "./spinner-icon.module.css";

type Props = {
  label?: string;
  size?: number | string;
};

export function SpinnerIcon({ label, size }: Props) {
  const accessibilityProps = label
    ? { role: "status" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return <CircleNotchIcon {...accessibilityProps} size={size} className={styles.base} />;
}
