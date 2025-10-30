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
    <input
      className="
        w-full
        bg-transparent
        outline-none
        text-base
        font-medium
        placeholder:text-neutral-400
        
        text-black
      "
      placeholder="Buscar producto"
      value={value}
      onChange={handleInput}
    />
  );
};

export default SearchBar;

