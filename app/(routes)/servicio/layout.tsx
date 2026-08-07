import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios de impresión 3D",
  description:
    "Modelado e impresión 3D personalizada en Chile. Cuéntanos tu idea y la fabricamos a pedido.",
  alternates: {
    canonical: "/servicio",
  },
};

export default function ServicioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
