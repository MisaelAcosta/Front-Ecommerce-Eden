import FeaturedProducts from "@/components/featured-products";
import ChooseCategory from "@/components/choose-category";
import Header from "@/components/header";
import NewProduct from "@/components/newProduct";
import TempProducts from "@/components/temp-products"
import Block2 from "@/components/block2";
import SmoothScroll from "@/components/animation_page/smooth-scroll";
import Subscriptions from "@/components/subscriptions";


export default function Home() {
  return (
  <SmoothScroll>
    <main>
      <Header />
      <FeaturedProducts />
      <NewProduct />
      <TempProducts/>
      <ChooseCategory />
      <Subscriptions />
    </main>
  </SmoothScroll>
  );
}


