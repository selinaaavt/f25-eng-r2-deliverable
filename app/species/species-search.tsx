"use client";

import { useState } from "react";
import SpeciesCard from "./species-card";

// Define the exact type expected by SpeciesCard
interface Species {
  id: number;
  author: string;
  scientific_name: string;
  common_name: string | null;
  description: string | null;
  image: string | null;
  kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
  total_population: number | null;
}

interface SpeciesSearchProps {
  species: Species[];
  userId: string;
}

export default function SpeciesSearch({ species, userId }: SpeciesSearchProps) {
  // State for the search input
  const [search, setSearch] = useState("");

  // Filter species case-insensitively
  const filteredSpecies = species.filter((s) => {
    const query = search.toLowerCase();
    return (
      (s.scientific_name ?? "").toLowerCase().includes(query) ||
      (s.common_name ?? "").toLowerCase().includes(query) ||
      (s.description ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Search input box */}
      <input
        type="text"
        placeholder="Search species..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />
      {/* Render filtered species */}
      <div className="flex flex-wrap justify-center gap-4">
        {filteredSpecies.map((s) => (
          <SpeciesCard key={s.id} species={s} userId={userId} />
        ))}
      </div>
    </div>
  );
}
