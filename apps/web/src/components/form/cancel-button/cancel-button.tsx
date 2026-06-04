import { Button } from "@/components/ui/button";
import { useFormContext } from "@/lib/tanstack-form/form-context";

import type { ComponentProps } from "react";

import styles from "./cancel-button.module.css";

type Props = Pick<ComponentProps<typeof Button>, "onClick"> & {
  isSubmitting: boolean;
};

export function CancelButton({ isSubmitting, onClick }: Props) {
  const form = useFormContext();

  return (
    <Button
      type="reset"
      variant="outline"
      disabled={isSubmitting}
      onClick={(e) => {
        form.reset();
        onClick?.(e);
      }}
      className={styles.base}
    >
      キャンセル
    </Button>
  );
}
