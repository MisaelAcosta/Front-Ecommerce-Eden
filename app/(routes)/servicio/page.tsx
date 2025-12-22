import  Header  from "@/app/(routes)/servicio/components/header"
import TipoServicios from "./components/tipoServicios"
import ModoTrabajo from "./modoTrabajo"
import Contacto from "@/app/(routes)/servicio/contacto"
import Galeria from "./components/galeria"
 


export default function Home () {
    return(
        <main>
            <Header></Header>
            <ModoTrabajo></ModoTrabajo>
            <Galeria></Galeria>
            <Contacto></Contacto>
        </main>
    )
}

