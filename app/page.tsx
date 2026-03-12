import FeaturedProducts from "@/components/featured-products";
import ChooseCategory from "@/components/choose-category";
import Header from "@/components/header";
import NewProduct from "@/components/newProduct";
import TempProducts from "@/components/temp-products"
import Block2 from "@/components/block2";


export default function Home() {
  return (
  <main>
    <Header />
    <FeaturedProducts />
    <TempProducts/>
    <Block2 />
    <NewProduct />
    <ChooseCategory />
    </main>
  );
}


