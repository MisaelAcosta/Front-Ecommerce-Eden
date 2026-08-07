import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { NavigationTransitionProvider } from "@/components/navigation-transition-provider";
import { ThemeProvider } from "@/components/theme.provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eden3d.cl"),
  title: {
    default: "Eden 3D",
    template: "%s | Eden 3D",
  },
  description: "Figuras, soportes y accesorios impresos en 3D. Envíos a todo Chile.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Eden 3D",
    description: "Figuras, soportes y accesorios impresos en 3D. Envíos a todo Chile.",
    url: "/",
    siteName: "Eden 3D",
    locale: "es_CL",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icons/nuevo%20icono.png",
        type: "image/png",
      },
    ],
    shortcut: "/icons/nuevo%20icono.png",
    apple: "/icons/nuevo%20icono.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider>
          <NavigationTransitionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster />
            <Footer />
          </NavigationTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
