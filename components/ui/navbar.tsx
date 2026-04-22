// components/navbar/navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Smile } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import { useCart } from "@/hooks/use-cart";
import { LoginDialog } from "@/components/auth/login-dialog";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type { CurrentUser, ProfileData } from "@/components/profile/profile-types";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ scroll effects logo escritorio
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const DESKTOP_LOGO_LIGHT = "/icons/logo-eden-white.png";
  const DESKTOP_LOGO_DARK = "/icons/logo-eden-black.png";


  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 40);

      const goingDown = y > lastY.current;
      if (y > 120 && goingDown) setHidden(true);
      else setHidden(false);

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          setProfile(null);
          setLoadingUser(false);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? null);
        setProfile(data.profile ?? null);
      } catch (error) {
        console.error("🔥 Error obteniendo usuario actual:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ SOLO EN /catalogo (y subrutas) forzamos el navbar en negro desde arriba
  const isCatalog = pathname.startsWith("/category/");
  const isProduct = pathname.startsWith("/product");
  const isCart = pathname.startsWith("/cart");
  const isLoved = pathname.startsWith("/loved-product");

  const forceDark = isCatalog || isProduct || isCart || scrolled || isLoved;

  const fg = forceDark ? "text-black" : "text-white";




// ✅ Logos mobile (centrado)
const MOBILE_LOGO_LIGHT = "/icons/logo-eden-white.png"; 
const MOBILE_LOGO_DARK = "/icons/logo-eden-black.png";  




  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${forceDark ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}
      `}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-3 lg:px-4">
        {/* Layout general: 3 columnas -> Left / Center / Right */}
        <div className="grid grid-cols-3 items-center py-2">
          {/* ================= LEFT ================= */}
          <div className="flex items-center justify-start gap-3">
            {/* Mobile: Hamburguesa a la izquierda */}
            <div className="flex lg:hidden">
              <ItemsMenuMobile scrolled={forceDark} />
            </div>

            {/* Desktop: Logo texto + menú */}
            <div className="hidden lg:flex items-center gap-10">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="relative h-10 w-[110px] lg:h-9 lg:w-[130px] transition-opacity duration-200 hover:opacity-80"
                aria-label="Ir al inicio"
              >
                <Image
                  key={forceDark ? "dark" : "light"}
                  src={forceDark ? DESKTOP_LOGO_DARK : DESKTOP_LOGO_LIGHT}
                  alt="Eden Logo"
                  fill
                  priority
                  className="object-contain "
                />
              </button>
              <div className={`text-xl ${fg}`}>
                <MenuList />
              </div>
            </div> 

            {/* Mobile: Smile pegadito a la hamburguesa */}
            {!loadingUser && (
              <div className="flex lg:hidden">
                {user ? (
                  <ProfileSheet
                    user={user}
                    profile={profile ?? undefined}
                    onLogout={() => {
                      setUser(null);
                      setProfile(null);
                    }}
                  >
                    <button aria-label="Perfil" className="cursor-pointer">
                      <Smile
                        strokeWidth={1.5}
                        fill="none"
                        className={`h-7 w-7 transition-colors duration-300 ${fg}`}
                      />
                    </button>
                  </ProfileSheet>
                ) : (
                  <LoginDialog>
                    <button aria-label="Iniciar sesión" className="cursor-pointer">
                      <Smile
                        strokeWidth={1.5}
                        fill="none"
                        className={`h-6 w-6 transition-colors duration-300 ${fg}`}
                      />
                    </button>
                  </LoginDialog>
                )}
              </div>
            )}
          </div>






          {/* ================= CENTER ================= */}
          <div className="flex items-center justify-center">
            {/* Mobile: logo ícono centrado */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="relative h-18 w-20 lg:hidden"
              aria-label="Ir al inicio"
            >
              <Image
                key={forceDark ? "m-dark" : "m-light"}
                src={forceDark ? MOBILE_LOGO_DARK : MOBILE_LOGO_LIGHT}
                alt="Eden logo"
                fill
                className="object-contain"
                priority
              />
            </button>

            {/* Desktop: no centro (porque el menú ya queda con el logo a la izquierda) */}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center justify-end gap-5 lg:gap-8">
            {/* Desktop: Smile (login/perfil) a la derecha */}
            {!loadingUser && (
              <div className="hidden lg:flex">
                {user ? (
                  <ProfileSheet
                    user={user}
                    profile={profile ?? undefined}
                    onLogout={() => {
                      setUser(null);
                      setProfile(null);
                    }}
                  >
                    <button aria-label="Perfil" className="cursor-pointer">
                      <Smile
                        strokeWidth={1.5}
                        fill="none"
                        className={`h-8 w-8 transition-colors duration-300 ${fg}`}
                      />
                    </button>
                  </ProfileSheet>
                ) : (
                  <LoginDialog>
                    <button aria-label="Iniciar sesión" className="cursor-pointer">
                      <Smile
                        strokeWidth={1.5}
                        fill="none"
                        className={`h-7 w-7 transition-colors duration-300 ${fg}`}
                      />
                    </button>
                  </LoginDialog>
                )}
              </div>
            )}

            {/* Heart: en desktop y mobile */}
            <Heart
              strokeWidth={1.5}
              className={`cursor-pointer h-7 w-7 transition-colors duration-300 ${fg}`}
              onClick={() => router.push("/loved-product")}
            />

            {/* Cart */}
            {cart.items.length === 0 ? (
              <ShoppingBag
                strokeWidth={1.5}
                className={`cursor-pointer h-7 w-7 transition-colors duration-300 ${fg}`}
                onClick={() => router.push("/cart")}
              />
            ) : (
              <div
                className={`flex cursor-pointer items-center gap-1 transition-colors duration-300 ${fg}`}
                onClick={() => router.push("/cart")}
              >
                <ShoppingBag strokeWidth={1.5} className="h-7 w-7" />
                <span className="text-sm font-semibold">{cart.items.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;





