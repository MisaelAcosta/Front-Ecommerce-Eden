
"use client"
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import  Autoplay  from "embla-carousel-autoplay";


export const dataCarouselTop = [
    {
        id: 1,
        title: "Envíos en 24 hrs",
        description: "Despachamos tu pedido en 24 horas a todo Chile",
        link: "#",
    },

    {
        id: 2,
        title: "Diseños personalizados",
        description: "Creamos piezas 3D únicas, hechas a tu medida.",
        link: "#",
    },
    {
        id: 3,
        title: "Compra seguro",
        description: "Paga con total confianza a través de Webpay.",
        link: "#",
    }
]




const StepCatalog = () => {
    const router = useRouter()
    return (
        <div className="bg-[#f3f3f3] dark:bg-primary">
            <Carousel
                className="w-full max-w-4x1 mx-auto"
                plugins={[
                    Autoplay({
                        delay: 3500 //ms
                    })
                ]}>
            <CarouselContent>
                {dataCarouselTop.map(({id, title, description}) => (
                <CarouselItem key={id} onClick={() => {}} className="">
                    <div>
                        <Card className="shadow-none border-none bg-transparent">
                            <CardContent className="flex flex-col items-center justify-center  ">
                                <p className="sm:text-2xl  font-extrabold text-wrap dark:text-secondary">{title}</p>
                                <p className="text-xs sm:text-sm dark:text-secondary ">{description}</p>
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

export default StepCatalog;