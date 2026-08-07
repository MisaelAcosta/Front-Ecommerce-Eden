import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotiza tu impresión 3D",
  description:
    "Sube tu modelo 3D, ajusta su escala y recibe una cotización para imprimirlo en FDM.",
  alternates: {
    canonical: "/cotiza",
  },
};

export default function CotizaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
