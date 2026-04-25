import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { NavigationTransitionProvider } from "@/components/navigation-transition-provider";
import { ThemeProvider } from "@/components/theme.provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eden.",
  description: "Compra productos 3D, figuras, soportes y mas en Eden 3D. Envios a todo Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
