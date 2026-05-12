"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Smile } from "lucide-react";
import { usePathname } from "next/navigation";
import { LoginDialog } from "@/components/auth/login-dialog";
import ItemsMenuMobile from "@/components/navbar/items-menu-mobile";
import MenuList from "@/components/navbar/menu-list";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type {
  CurrentUser,
  ProfileData,
} from "@/components/profile/profile-types";
import { useNavigationTransition } from "@/components/navigation-transition-provider";
import { useCart } from "@/hooks/use-cart";

// ===== # Navbar | Assets =====
// Assets del desktop inspirados en las referencias: wordmark principal.
const DESKTOP_WORDMARK = "/icons/op/white_eden.png";
const MOBILE_CENTER_LOGO = "/icons/op/white_ilust.png";

const Navbar = () => {
  // ===== # Navbar | Hooks y contexto principal =====
  const pathname = usePathname();
  const cart = useCart();
  const { navigateWithTransition } = useNavigationTransition();

  // ===== # Navbar | Estado local =====
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // ===== # Navbar | Comportamiento de scroll =====
  // Comportamiento de desaparicion/aparicion al hacer scroll.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      const goingDown = y > lastY.current;
      if (y > 120 && goingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== # Navbar | Sesion del usuario =====
  // Estado de sesion para desktop y mobile.
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
        console.error("Error obteniendo usuario actual:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // ===== # Navbar | Navegacion reutilizable =====
  const handleGoHome = () => navigateWithTransition("/");
  const handleGoLoved = () => navigateWithTransition("/loved-product");
  const handleGoCart = () => navigateWithTransition("/cart");

  // ===== # Navbar | Helpers de acciones =====
  // Triggers reutilizables para no duplicar la misma logica de sesion.
  const renderProfileButton = (iconClassName: string) => {
    if (loadingUser) {
      return null;
    }

    const icon = (
      <Smile strokeWidth={1.5} fill="none" className={iconClassName} />
    );

    if (user) {
      return (
        <ProfileSheet
          user={user}
          profile={profile ?? undefined}
          onLogout={() => {
            setUser(null);
            setProfile(null);
          }}
        >
          <button
            aria-label="Perfil"
            className="cursor-pointer rounded-full p-2 transition-colors duration-300 hover:bg-white/10"
          >
            {icon}
          </button>
        </ProfileSheet>
      );
    }

    return (
      <LoginDialog>
        <button
          aria-label="Iniciar sesion"
          className="cursor-pointer rounded-full p-2 transition-colors duration-300 hover:bg-white/10"
        >
          {icon}
        </button>
      </LoginDialog>
    );
  };

  // Renderiza el boton de carrito con o sin contador segun la cantidad de items.
  const renderCartButton = (iconClassName: string, countClassName: string) => {
    if (cart.items.length === 0) {
      return (
        <button
          type="button"
          aria-label="Ir al carrito"
          className="cursor-pointer"
          onClick={handleGoCart}
        >
          <ShoppingBag strokeWidth={1.5} className={iconClassName} />
        </button>
      );
    }

    return (
      <button
        type="button"
        aria-label="Ir al carrito"
        className="inline-flex cursor-pointer items-center gap-2"
        onClick={handleGoCart}
      >
        <ShoppingBag strokeWidth={1.5} className={iconClassName} />
        <span className={countClassName}>{cart.items.length}</span>
      </button>
    );
  };

  return (
    // ===== # Navbar | Estructura principal =====
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        {/* ===== # Navbar Desktop ===== */}
        {/* Desktop: barra flotante tipo capsule inspirada en las referencias. */}
        <div className="hidden pt-4 lg:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-[30px] border border-white/10 bg-[rgba(42,42,39,0.76)] px-6 py-3 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            {/* ---- Columna izquierda desktop: enlaces de navegacion ---- */}
            <div className="min-w-0">
              <MenuList pathname={pathname} />
            </div>

            {/* ---- Columna central desktop: identidad y regreso al inicio ---- */}
            <button
              type="button"
              onClick={handleGoHome}
              className="group inline-flex items-center justify-center rounded-full px-3 py-2"
              aria-label="Ir al inicio"
            >
              <span className="relative block h-9 w-[120px] overflow-visible ">
                <Image
                  src={DESKTOP_WORDMARK}
                  alt="Eden"
                  fill
                  priority
                  className="object-contain scale-[2.2] cursor-pointer"
                />
              </span>
            </button>



            {/* ---- Columna derecha desktop: perfil, favoritos y carrito ---- */}
            <div className="flex items-center justify-end">
              <div
                  className="
                  inline-flex
                  items-center
                  justify-between
                  min-w-[190px]
                  h-[54px]
                  rounded-full
                  border
                  border-white/10
                  bg-[#1A1A1A]

                  px-7
                  py-2
                  "
                >
                {renderProfileButton(
                  [
                    "h-6",
                    "w-6",
                    "text-white/90",
                    "transition-colors",
                    "duration-300",
                  ].join(" ")
                )}

                <button
                  type="button"
                  aria-label="Ir a favoritos"
                  className="rounded-full p-2 text-white/80 transition-colors 
                  duration-300 hover:bg-white/10 hover:text-white cursor-pointer"
                  onClick={handleGoLoved}
                >
                  <Heart strokeWidth={1.5} className="h-6 w-6" />
                </button>

                <div className="h-5 w-px bg-white/15" />

                <div className="rounded-full px-2 py-1 text-white/90 
                transition-colors duration-300 hover:bg-white/10 
                hover:text-white">
                  {renderCartButton("h-6 w-6", "text-xs font-semibold")}
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* ===== # Navbar Mobile ===== */}
        {/* Mobile: replicamos el lenguaje capsule del desktop en formato compacto. */}
        <div
          className={`
            py-3 lg:hidden
            transition-all duration-300
          `}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full border border-white/10 bg-[rgba(26,26,26,0.94)] px-3 py-2 text-white shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl">
            {/* ---- Columna izquierda mobile: boton menu y acceso a perfil ---- */}
            <div className="flex items-center gap-1">
              <div className="rounded-full border border-white/10 bg-white/6 p-1">
                <ItemsMenuMobile scrolled={false} />
              </div>

              <div className="rounded-full border border-white/10 bg-white/6 p-1">
                {renderProfileButton(
                  [
                    "h-5",
                    "w-5",
                    "text-white/90",
                    "transition-colors",
                    "duration-300",
                  ].join(" ")
                )}
              </div>
            </div>

            {/* ---- Columna central mobile: wordmark alineado al nuevo estilo ---- */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoHome}
                className="group inline-flex items-center justify-center rounded-full px-2 py-1"
                aria-label="Ir al inicio"
              >
                <span className="relative block h-9 w-[100px] overflow-visible  
                sm:h-11 sm:w-11">
                  <Image
                    src={MOBILE_CENTER_LOGO}
                    alt="Eden"
                    fill
                    priority
                    className="object-contain"
                  />
                </span>
              </button>
            </div>

            {/* ---- Columna derecha mobile: favoritos y carrito dentro de capsule ---- */}
            <div className="flex items-center justify-end">
              <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 p-1">
                <button
                  type="button"
                  aria-label="Ir a favoritos"
                  className="rounded-full p-2 text-white/80 transition-colors duration-300 hover:bg-white/10 hover:text-white"
                  onClick={handleGoLoved}
                >
                  <Heart strokeWidth={1.5} className="h-5 w-5" />
                </button>

                <div className="h-4 w-px bg-white/15" />

                <div className="rounded-full px-2 py-1 text-white/90 transition-colors duration-300 hover:bg-white/10 hover:text-white">
                  {renderCartButton("h-5 w-5", "text-[11px] font-semibold")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
