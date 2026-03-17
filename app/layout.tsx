import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme.provider";
const inter = Inter({subsets: ["latin"],});
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "eden.",
  description: "Compra productos 3D, figuras, soportes y más en Eden 3D. Envíos a todo Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>


        <ThemeProvider>
          <Navbar></Navbar>
            <main className="flex-1">
            {children}
          </main>
          <Toaster></Toaster>
          <Footer></Footer>
        </ThemeProvider>

      </body>
    </html>
  );
}
