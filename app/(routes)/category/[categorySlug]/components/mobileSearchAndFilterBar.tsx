"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react"; // ícono de sliders (instala lucide-react si no lo tienes)
import SearchBar from "./searchBar";
import FilterCategory from "./filter-category";

type MobileSearchAndFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;

  // esto viene de tu page, lo usas para filtrar subcategoría
  onSelectSubcategory: (slugSub: string | null) => void;
};

const MobileSearchAndFilterBar = ({
  searchValue,
  onSearchChange,
  onSelectSubcategory,
}: MobileSearchAndFilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <section className="md:hidden w-full">
      {/* barra pill gris */}
      <div
        className="
          flex items-center justify-between
          w-full
          bg-[#f5f5f5]
          rounded-full
          px-4 py-3
        "
      >
        {/* Input */}
        <div className="flex-1">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>

        {/* Botón filtros */}
        <button
          onClick={toggleFilters}
          className="
            flex-shrink-0
            ml-3
            flex flex-col items-center justify-center
            text-black
          "
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* zona desplegable con las categorías */}
      {showFilters && (
        <div
          className="
            mt-4
            rounded-xl
            border border-neutral-200
            bg-white
            p-3
            shadow-sm
          "
        >
          <FilterCategory onSelectSubcategory={onSelectSubcategory} />
        </div>
      )}
    </section>
  );
};

export default MobileSearchAndFilterBar;
