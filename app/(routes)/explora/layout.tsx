import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Eden 3D y políticas",
  description:
    "Conoce Eden 3D, nuestras políticas de privacidad y los términos y condiciones de compra.",
  alternates: {
    canonical: "/explora",
  },
};

export default function ExploraLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
