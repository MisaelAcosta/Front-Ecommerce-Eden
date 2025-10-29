"use client";

import { ChangeEvent } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full flex items-center gap-2 border rounded-md px-3 py-2 text-sm">
      <input
        className="w-full bg-transparent outline-none text-sm"
        placeholder="Buscar producto..."
        value={value}
        onChange={handleInput}
      />
      {/* si quieres un iconito de lupa, puedes meter un LucideSearch acá */}
    </div>
  );
};

export default SearchBar;

