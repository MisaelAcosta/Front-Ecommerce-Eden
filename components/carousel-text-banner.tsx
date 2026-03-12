"use client"
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import  Autoplay  from "embla-carousel-autoplay";


export const dataCarouselTop = [
    {
        id: 1,
        title: "COMPRA",
        description: "Agrega al carrito, ingresa tus datos y paga en segundos con Flow. Rápido y seguro.",
        link: "#",
        
    },
    {
        id: 2,
        title: "TE AVISAMOS",
        description: "Despachamos tu pedido y te enviamos el número de seguimiento.",
        link: "#",
        
    },
    {
        id: 3,
        title: "DISFRUTA",
        description: "Recibe tu producto sin complicaciones.",
        link: "#",
        
    }
]



const CarouselTextBanner = () => {
    return (
        <div className="bg-[#f3f3f3] mt-5 sm:mt-0 dark:bg-primary">
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
                            <CardContent className="flex flex-col items-center leading-none justify-center gap-1 sm:gap-none py-0">
                                

                                <p className="sm:text-lg  font-black text-wrap text-red-600">
                                    {title}
                                </p>

                                <p className="text-xs sm:text-sm dark:text-secondary text-center max-w-xs">
                                    {description}
                                </p>

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