"use client";

import { useEffect, useState } from "react";
import { BaggageClaim, Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "../menu-list";
import ItemsMenuMobile from "../items-menu-mobile";
import ToggleTheme from "../toggle-theme";
import { useCart } from "@/hooks/use-cart";
import { LoginDialog } from "@/components/auth/login-dialog";
import { ProfileSheet, type CurrentUser } from "@/components/profile/profile-sheet";

const Navbar = () => {
  const router = useRouter();
  const cart = useCart();

  const [user, setUser] = useState<CurrentUser | null>(null);
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
          setLoadingUser(false);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? null);
      } catch (error) {
        console.error("🔥 Error obteniendo usuario actual:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className=" flex items-center justify-between p-8 pb-1 w-full">
      {/*Logo*/}
      <div
        className="
        mx-3 flex items-center gap-4
        md:mx-25 md:gap-8
        lg:mx-5
      "
      >
        <h1
          className="
          font-black text-3xl cursor-pointer
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
        flex items-center gap-6 mx-2
        md:gap-4 md:mx-5
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
            className="flex gap-1 cursor-pointer"
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

        {/* Aquí cambiamos INICIAR ↔ PERFIL */}
        {!loadingUser && (
          <>
            {user ? (
              // Si hay usuario → Perfil con sheet lateral
              <ProfileSheet user={user} />
            ) : (
              // Si NO hay usuario → LoginDialog con botón Iniciar
              <LoginDialog>
                <span
                  className="
                    hidden
                    md:flex
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

