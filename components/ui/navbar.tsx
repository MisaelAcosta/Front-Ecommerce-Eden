// components/navbar/navbar.tsx (tu archivo)
"use client";

import { useEffect, useState } from "react";
import { BaggageClaim, Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";
import { useCart } from "@/hooks/use-cart";
import { LoginDialog } from "@/components/auth/login-dialog";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type {
  CurrentUser,
  ProfileData,
} from "@/components/profile/profile-types";

const Navbar = () => {
  const router = useRouter();
  const cart = useCart();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
        console.log("🟦 /api/auth/me →", data);

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

  return (
    <div className="flex w-full items-center justify-between p-8 pb-1">
      {/* Logo */}
      <div
        className="
        mx-3 flex items-center gap-4
        md:mx-25 md:gap-8
        lg:mx-5
      "
      >
        <h1
          className="
          cursor-pointer
          text-3xl
          font-black
          md:text-3xl
          lg:text-5xl
        "
          onClick={() => router.push("/")}
        >
          Eden
        </h1>

        <div className="hidden md:flex lg:text-5xl">
          <MenuList />
        </div>
      </div>

      {/* Sección derecha: Iconos */}
      <div
        className="
        mx-2 flex items-center gap-6
        md:mx-5 md:gap-4
      "
      >
        {cart.items.length === 0 ? (
          <ShoppingCart
            strokeWidth={1}
            className="cursor-pointer"
            onClick={() => router.push("/cart")}
          />
        ) : (
          <div
            className="flex cursor-pointer gap-1"
            onClick={() => router.push("/cart")}
          >
            <BaggageClaim strokeWidth={1} className="cursor-pointer" />
            <span>{cart.items.length}</span>
          </div>
        )}

        <Heart
          strokeWidth={1}
          className="cursor-pointer"
          onClick={() => router.push("/loved-products")}
        />

        {/* INICIAR ↔ PERFIL */}
        {!loadingUser && (
          <>
            {user ? (
              <ProfileSheet
                user={user}
                profile={profile ?? undefined}
                onLogout={() => {
                  // 👇 esto hace que la UI cambie INMEDIATAMENTE
                  setUser(null);
                  setProfile(null);
                }}
              />
            ) : (
              <LoginDialog>
                <span
                  className="
                    hidden
                    cursor-pointer
                    rounded-2xl
                    border
                    border-black
                    px-4
                    py-1
                    font-bold
                    hover:bg-black
                    hover:text-white
                    transition
                    duration-200
                    ease-in-out
                    md:flex
                  "
                >
                  Iniciar
                </span>
              </LoginDialog>
            )}
          </>
        )}

        {/* Menu móvil */}
        <div className="flex sm:hidden">
          <ItemsMenuMobile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;


