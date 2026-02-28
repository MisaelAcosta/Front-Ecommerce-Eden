import  Header  from "@/app/(routes)/servicio/components/header"
import ModoTrabajo from "./modoTrabajo"
import Contacto from "@/app/(routes)/servicio/contacto"
import Galeria from "./components/galeria"
import Modelodo3D from "./modelado3d"
 


export default function Home () {
    return(
        <main>
            <Header></Header>
            <Modelodo3D></Modelodo3D>
            <ModoTrabajo></ModoTrabajo>
            <Galeria></Galeria>
            <Contacto></Contacto>
        </main>
    )
}

