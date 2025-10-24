import BannerDiscount from "@/components/banner-discount";
import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProducts from "@/components/featured-products";
import ChooseCategory from "@/components/choose-category";
import Header from "@/components/header";
import NewProduct from "@/components/newProduct";
import Cta from "@/components/cta";
import TempProducts from "@/components/temp-products"


export default function Home() {
  return (
  <main>
    <Header />
    <FeaturedProducts />
    <CarouselTextBanner />
    <TempProducts/>
    <ChooseCategory />
    <NewProduct />
    <Cta />
  </main>
  );
}


