"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UpdateSpotForm } from "./update-spot-form";

import type { ListSpotsItem } from "@/features/spot/types/api";

type Props = {
  spot: ListSpotsItem;
};

export function UpdateSpotModal({ spot }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline">Edit</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Editing ${spot.name}`}</DialogTitle>
        </DialogHeader>
        <UpdateSpotForm spot={spot} onSubmit={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
