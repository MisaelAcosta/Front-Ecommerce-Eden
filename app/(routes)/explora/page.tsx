"use client";

import TerminosCondiciones from "./components/terminos-condiciones";
import SobreNosotros from "./components/sobre-nosostros";
import PoliticasPrivacidad from "./components/politicas-privacidad";


const Page = () => {
    return (
        <div className="">
            <SobreNosotros></SobreNosotros>
            <TerminosCondiciones></TerminosCondiciones>
             <PoliticasPrivacidad></PoliticasPrivacidad>
        </div>
    )
}

export default Page;