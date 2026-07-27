"use client";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // VISIBILIDAD
  // La paginacion no ocupa espacio cuando todos los productos caben en una sola pagina.
  if (totalPages <= 1) return null;

  // NUMEROS DE PAGINA
  // Este arreglo alimenta los botones numericos del centro.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    // CONTENEDOR VISUAL
    // `mt-6` separa la navegacion de la grilla; `gap-2` controla el espacio entre botones.
    <div className="mt-6 flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Anterior
      </Button>

      {pages.map((num) => (
        <Button
          key={num}
          variant={num === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(num)}
        >
          {num}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente →
      </Button>
    </div>
  );
};

