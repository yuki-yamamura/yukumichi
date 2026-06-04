import { Button } from "@/components/ui/button";

import styles from "./submit-button.module.css";

type Props = {
  isSubmitting: boolean;
};

export function SubmitButton({ isSubmitting }: Props) {
  return (
    <Button type="submit" disabled={isSubmitting} className={styles.base}>
      送信
    </Button>
  );
}
