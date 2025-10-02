import BannerDiscount from "@/components/banner-discount";
import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProducts from "@/components/featured-products";
import ChooseCategory from "@/components/choose-category";
import Header from "@/components/header";
import NewProduct from "@/components/newproduct";


export default function Home() {
  return (
  <main>
    <Header />
    <FeaturedProducts />
    {/*<BannerDiscount />*/}
    <ChooseCategory />
    <CarouselTextBanner />
    <NewProduct />
  </main>
  );
}


