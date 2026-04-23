import  Header  from "@/app/(routes)/servicio/components/header"
import ModoTrabajo from "./components/modoTrabajo"
import Contacto from "@/app/(routes)/servicio/contacto"
import Galeria from "./components/galeria"
import Modelodo3D from "./modelado3d"
 


export default function Home () {
    return(
        <main className="space-y-12 sm:space-y-16">
            <Header></Header>
            <Modelodo3D></Modelodo3D>
            <ModoTrabajo></ModoTrabajo>
            <Galeria></Galeria>
            <Contacto></Contacto>
        </main>
    )
}

