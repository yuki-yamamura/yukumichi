"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UpdateSpotModal } from "@/features/spot/components/update-spot-modal";

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
            render={<Link href={`/spots/${spot.id}`}>{spot.name}</Link>}
          />
          <div>({spot.description})</div>
          <UpdateSpotModal spot={spot} />
        </li>
      ))}
    </ul>
  );
}
