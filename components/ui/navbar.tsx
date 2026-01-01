// components/navbar/navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BaggageClaim, Heart, ShoppingCart, User, UserCheck } from "lucide-react";
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

  // ✅ scroll effects
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 40);

      // hide when scrolling down, show when scrolling up
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

  const AuthIcon = user ? UserCheck : User;

  // ✅ SOLO EN /catalogo (y subrutas) forzamos el navbar en negro desde arriba
  const isCatalog = pathname.startsWith("/category/");
  const isProduct = pathname.startsWith("/product");
  const isCart = pathname.startsWith("/cart");

    

  // forceDark = si estoy en catálogo o si ya scrolleé (comportamiento normal)
  
  const forceDark = isCatalog || isProduct || isCart || scrolled;
  


  const fg = forceDark ? "text-black" : "text-white";
  const border = forceDark ? "border-black" : "border-white";
  const hoverBtn = forceDark
    ? "hover:bg-black hover:text-white"
    : "hover:bg-white hover:text-black";

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        border-b
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${forceDark ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"}
      `}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-3">
        <div className="flex w-full items-center justify-between py-2">
          {/* Logo + menú */}
          <div className="flex items-center gap-4 md:gap-10">
            <h1
              className={`
                cursor-pointer text-3xl font-black md:text-2xl lg:text-4xl
                transition-colors duration-300
                ${fg}
              `}
              onClick={() => router.push("/")}
            >
              EDEN.
            </h1>

            <div className={`hidden md:flex transition-colors duration-300 ${fg}`}>
              <MenuList />
            </div>
          </div>

          {/* Iconos */}
          <div className="flex items-center gap-6 md:gap-4">
            {cart.items.length === 0 ? (
              <ShoppingCart
                strokeWidth={1.5}
                className={`cursor-pointer h-6 w-6 transition-colors duration-300 ${fg}`}
                onClick={() => router.push("/cart")}
              />
            ) : (
              <div
                className={`flex cursor-pointer gap-1 items-center transition-colors duration-300 ${fg}`}
                onClick={() => router.push("/cart")}
              >
                <BaggageClaim strokeWidth={1.5} className="h-6 w-6" />
                <span className="text-sm font-semibold">{cart.items.length}</span>
              </div>
            )}

            <Heart
              strokeWidth={1.2}
              className={`cursor-pointer hidden md:inline h-6 w-6 transition-colors duration-300 ${fg}`}
              onClick={() => router.push("/loved-products")}
            />

            {/* Desktop: Iniciar / Perfil */}
            {!loadingUser && (
              <>
                <div className="hidden sm:flex">
                  {user ? (
                    <ProfileSheet
                      user={user}
                      profile={profile ?? undefined}
                      onLogout={() => {
                        setUser(null);
                        setProfile(null);
                      }}
                    />
                  ) : (
                    <LoginDialog>
                      <span
                        className={`
                          cursor-pointer rounded-2xl border px-4 py-1 font-bold
                          transition duration-200 ease-in-out
                          ${fg} ${border} ${hoverBtn}
                        `}
                      >
                        Iniciar
                      </span>
                    </LoginDialog>
                  )}
                </div>

                {/* Mobile: icono */}
                <div className="flex sm:hidden">
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
                        <AuthIcon
                          strokeWidth={1.5}
                          className={`h-6 w-6 transition-colors duration-300 ${fg}`}
                        />
                      </button>
                    </ProfileSheet>
                  ) : (
                    <LoginDialog>
                      <button aria-label="Iniciar sesión" className="cursor-pointer">
                        <AuthIcon
                          strokeWidth={1.5}
                          className={`h-6 w-6 transition-colors duration-300 ${fg}`}
                        />
                      </button>
                    </LoginDialog>
                  )}
                </div>
              </>
            )}

            <div className="flex sm:hidden">
              <ItemsMenuMobile scrolled={forceDark} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;




