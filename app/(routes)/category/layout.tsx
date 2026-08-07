import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de productos 3D",
  description:
    "Explora figuras, soportes, accesorios y regalos impresos en 3D hechos por Eden 3D.",
};

export default function CategoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
