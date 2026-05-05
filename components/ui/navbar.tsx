"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Smile } from "lucide-react";
import { usePathname } from "next/navigation";
import { LoginDialog } from "@/components/auth/login-dialog";
import ItemsMenuMobile from "@/components/items-menu-mobile";
import MenuList from "@/components/menu-list";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type { CurrentUser, ProfileData } from "@/components/profile/profile-types";
import { useNavigationTransition } from "@/components/navigation-transition-provider";
import { useCart } from "@/hooks/use-cart";

// Assets del desktop inspirados en las referencias: isotipo + wordmark.
const DESKTOP_ICON = "/icons/op/white_ilust.png";
const DESKTOP_WORDMARK = "/icons/op/white_eden.png";

// Assets compactos del mobile.
const MOBILE_LOGO_LIGHT = "/icons/logo-eden-white.png";
const MOBILE_LOGO_DARK = "/icons/logo-eden-black.png";

const Navbar = () => {
  const pathname = usePathname();
  const cart = useCart();
  const { navigateWithTransition } = useNavigationTransition();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Comportamiento de desaparicion/aparicion al hacer scroll.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 40);

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

  const isCatalog = pathname.startsWith("/category/");
  const isProduct = pathname.startsWith("/product");
  const isCart = pathname.startsWith("/cart");
  const isLoved = pathname.startsWith("/loved-product");
  const isService = pathname.startsWith("/servicio");
  const isCotiza = pathname.startsWith("/cotiza");
  const isHome = pathname === "/";

  const forceDark =
    isCatalog ||
    isProduct ||
    isCart ||
    scrolled ||
    isLoved ||
    isService ||
    isCotiza ||
    isHome;
  const mobileFg = forceDark ? "text-black" : "text-white";

  const handleGoHome = () => navigateWithTransition("/");
  const handleGoLoved = () => navigateWithTransition("/loved-product");
  const handleGoCart = () => navigateWithTransition("/cart");

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
          <button aria-label="Perfil" className="cursor-pointer">
            {icon}
          </button>
        </ProfileSheet>
      );
    }

    return (
      <LoginDialog>
        <button aria-label="Iniciar sesion" className="cursor-pointer">
          {icon}
        </button>
      </LoginDialog>
    );
  };

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
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
        {/* Desktop: barra flotante tipo capsule inspirada en las referencias. */}
        <div className="hidden pt-4 lg:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-[30px] border border-white/10 bg-[rgba(42,42,39,0.76)] px-6 py-3 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="min-w-0">
              <MenuList pathname={pathname} />
            </div>

            <button
              type="button"
              onClick={handleGoHome}
              className="group inline-flex items-center gap-3 rounded-full px-3 py-2 transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Ir al inicio"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <span className="relative h-6 w-6">
                  <Image
                    src={DESKTOP_ICON}
                    alt="Eden icono"
                    fill
                    priority
                    className="object-contain"
                  />
                </span>
              </span>

              <span className="relative h-5 w-[88px]">
                <Image
                  src={DESKTOP_WORDMARK}
                  alt="Eden"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </span>
            </button>

            <div className="flex items-center justify-end">
              <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 p-1.5">
                {renderProfileButton(
                  "h-7 w-7 text-white/90 transition-colors duration-300"
                )}

                <button
                  type="button"
                  aria-label="Ir a favoritos"
                  className="rounded-full p-2 text-white/80 transition-colors duration-300 hover:bg-white/10 hover:text-white"
                  onClick={handleGoLoved}
                >
                  <Heart strokeWidth={1.5} className="h-6 w-6" />
                </button>

                <div className="h-5 w-px bg-white/15" />

                <div className="rounded-full px-2 py-1 text-white/90 transition-colors duration-300 hover:bg-white/10 hover:text-white">
                  {renderCartButton("h-6 w-6", "text-xs font-semibold")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: conservamos el navbar compacto y solo afinamos la logica visual. */}
        <div
          className={`
            grid grid-cols-3 items-center py-2 lg:hidden
            transition-colors duration-300
            ${forceDark ? "bg-white/90 backdrop-blur-md" : "bg-transparent"}
          `}
        >
          <div className="flex items-center justify-start gap-3">
            <ItemsMenuMobile scrolled={forceDark} />
            <div className="flex">
              {renderProfileButton(
                `h-6 w-6 transition-colors duration-300 ${mobileFg}`
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleGoHome}
              className="relative h-18 w-20"
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
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              aria-label="Ir a favoritos"
              className={mobileFg}
              onClick={handleGoLoved}
            >
              <Heart
                strokeWidth={1.5}
                className={`h-6 w-6 transition-colors duration-300 ${mobileFg}`}
              />
            </button>

            <div className={mobileFg}>
              {renderCartButton(
                `h-6 w-6 transition-colors duration-300 ${mobileFg}`,
                "text-xs font-semibold"
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
