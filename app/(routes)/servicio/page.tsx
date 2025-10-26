import  Header  from "@/app/(routes)/servicio/components/header"
import TipoServicios from "./components/tipoServicios"
import ModoTrabajo from "./modoTrabajo"
import Contacto from "@/app/(routes)/servicio/contacto"
 


export default function Home () {
    return(
        <main>
            <Header></Header>
            <TipoServicios></TipoServicios>
            <ModoTrabajo></ModoTrabajo>
            <Contacto></Contacto>
        </main>
    )
}

