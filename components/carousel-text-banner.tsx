"use client"
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import  Autoplay  from "embla-carousel-autoplay";


export const dataCarouselTop = [
    {
        id: 1,
        title: "Envios en 24/horas",
        description: "Revisa nuestra ofertas del dia",
        link: "#",
    },

    {
        id: 2,
        title: "La mejor calidad",
        description: "Bienvenido a Eden",
        link: "#",
    }
]




const CarouselTextBanner = () => {
    const router = useRouter()
    return (
        <div className="bg-gray-200 dark:bg-primary">
            <Carousel
                className="w-full max-w-4x1 mx-auto"
                plugins={[
                    Autoplay({
                        delay: 3500 //ms
                    })
                ]}>
            <CarouselContent>
                {dataCarouselTop.map(({id, title, link, description}) => (
                <CarouselItem key={id} onClick={() => router.push(link)} className="cursor-pointer">
                    <div>
                        <Card className="shadow-none border-none bg-transparent">
                            <CardContent className="flex flex-col items-center justify-center  ">
                                <p className="sm:text-lg text-wrap dark:text-secondary">{title}</p>
                                <p className="text-xs text-sm dark:text-secondary ">{description}</p>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
        </div>
    );
};

export default CarouselTextBanner;