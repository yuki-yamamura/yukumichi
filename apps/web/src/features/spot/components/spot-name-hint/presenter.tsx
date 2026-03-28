"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Spot } from "../../types/api";

import styles from "./presenter.module.css";

type Props = {
  spot: Spot;
};

export function SpotNameHintPresenter({ spot }: Props) {
  const [isSpotNameDisplayed, setIsSpotNameDisplayed] = useState(false);

  const handleButtonClick = () => {
    setIsSpotNameDisplayed(true);
  };

  return (
    <div className={styles.base}>
      <div>
        {isSpotNameDisplayed
          ? spot.name
          : "<Click the button to show the spot name>"}
      </div>
      <Button
        type="button"
        disabled={isSpotNameDisplayed}
        onClick={handleButtonClick}
      >
        Show
      </Button>
    </div>
  );
}
