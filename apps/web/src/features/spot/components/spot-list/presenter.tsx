"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { SpotItem } from "@/features/spot/types/api";

import styles from "./presenter.module.css";

type Props = {
  spots: SpotItem[];
};

export function SpotListPresenter({ spots }: Props) {
  return (
    <ul>
      {spots.map((spot) => (
        <li key={spot.id} className={styles.listItem}>
          <Button
            variant="link"
            nativeButton={false}
            render={<Link href={`/spots/${spot.id as string}`}>{spot.name}</Link>}
          />
          <div>({spot.description})</div>
        </li>
      ))}
    </ul>
  );
}
