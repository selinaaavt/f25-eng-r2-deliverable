"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Species = {
  scientific_name: string;
  common_name: string | null;
  total_population: number | null;
  kingdom: string;
  description: string | null;
};

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Learn more</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.common_name ?? species.scientific_name}</DialogTitle>
          <DialogDescription>
            Detailed information about this species
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p><strong>Scientific Name:</strong> {species.scientific_name}</p>
          <p><strong>Common Name:</strong> {species.common_name ?? "N/A"}</p>
          <p><strong>Kingdom:</strong> {species.kingdom}</p>
          <p><strong>Total Population:</strong> {species.total_population ?? "Unknown"}</p>
          <div>
            <strong>Description:</strong>
            <p>{species.description ?? "No description available."}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}