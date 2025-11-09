"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface CarouselProductProps {
  images?: { id?: number; url?: string }[];
}

const CarouselProduct = ({ images }: CarouselProductProps) => {
  // Evitamos el error si no hay imágenes
  if (!images || images.length === 0) {
    return (
      <div className="sm:px-16 text-center py-8 text-muted-foreground">
        No hay imágenes disponibles.
      </div>
    );
  }

  return (
    <div className="sm:px-16">
      <Carousel>
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={img.id || index}>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`}
                alt="Imagen del producto"
                className="rounded-lg w-full h-auto object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CarouselProduct;
