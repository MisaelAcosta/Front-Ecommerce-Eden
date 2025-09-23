import BannerDiscount from "@/components/banner-discount";
import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProducts from "@/components/featured-products";
import ChooseCategory from "@/components/choose-category";
import Header from "@/components/header";

export default function Home() {
  return (
  <main>
    <Header />
    <FeaturedProducts />
    <BannerDiscount />
    <CarouselTextBanner />
    <ChooseCategory/>
  </main>
  );
}


