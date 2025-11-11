"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CarouselProductProps {
  images?: { id?: number; url?: string }[];
}

const CarouselProduct = ({ images }: CarouselProductProps) => {
  // Evitamos el error si no hay imágenes
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay imágenes disponibles.
      </div>
    );
  }

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const srcOf = (u?: string) =>
    u?.startsWith("http")
      ? u
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${u ?? ""}`;

  return (
    <div className="w-full pt-6 md:pt-0 " >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="relative"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={img.id ?? index} className=" ">
              {/* Marco / proporción como el mock */}
              <div className="w-full aspect-[3/3]  md:rounded-2xl md:border overflow-hidden">
                <img
                  src={srcOf(img.url)}
                  alt={`Imagen ${index + 1} del producto`}
                  className="h-full w-full object-contain select-none"
                  draggable={false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controles overlay, discretos al borde */}
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 hidden md:flex" />
      </Carousel>


      

      {/* Puntos de paginación como en la imagen */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a la imagen ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition ${
              current === i
                ? "bg-foreground"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselProduct;
