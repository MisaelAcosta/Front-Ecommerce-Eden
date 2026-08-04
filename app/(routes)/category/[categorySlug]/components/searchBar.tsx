"use client";

import { ChangeEvent } from "react";
import localFont from "next/font/local";
import { khInterferenceLightFont } from "@/app/(routes)/cart/components/cart-fonts";

// Tipografia del catalogo para que el buscador mantenga el mismo lenguaje visual.
const khInterferenceRegularFont = localFont({
  src: "../../../../../components/fonts/KHInterferenceTRIAL-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
});

type SearchBarProps = {
  // Texto que controla la pagina del catalogo para filtrar productos globalmente.
  value: string;
  // Devuelve cada cambio de escritura al estado padre.
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  // LOGICA DE BUSQUEDA
  // Mantiene este componente presentacional y delega el filtrado real a la pagina.
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    // CAMPO VISUAL DE BUSQUEDA
    // Editar `h-[40px]` cambia su alto. `bg-neutral-100` controla el gris de fondo
    // y `px-5` controla el aire horizontal del texto dentro del buscador.
    <input
      className={`${khInterferenceLightFont.className}
        h-[40px] w-full bg-[#1B2C1C] px-5
        text-[14px] text-[#ADFE00] outline-none
        placeholder:text-[#ADFE00]/35
        transition-colors focus:bg-[#1B2C1C]`}
      placeholder="Buscar"
      value={value}
      onChange={handleInput}
    />
  );
};

export default SearchBar;

