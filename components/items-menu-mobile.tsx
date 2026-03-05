"use client";

import { Menu, X, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { LoginDialog } from "@/components/auth/login-dialog";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type { CurrentUser, ProfileData } from "@/components/profile/profile-types";

const overlayVariants = (originPx: string) => ({
  initial: { clipPath: `circle(0px at ${originPx})` },
  animate: {
    clipPath: `circle(200vmax at ${originPx})`,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: {
    clipPath: `circle(0px at ${originPx})`,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
});

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeInOut" } },
};

// scroller
type ItemsMenuMobileProps = {
  scrolled: boolean;
};

export default function ItemsMenuMobile({ scrolled }: ItemsMenuMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [originPx, setOriginPx] = useState("100% 0%");
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // ✅ portal mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ auth
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const computeOrigin = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setOriginPx(`${x}px ${y}px`);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        setProfile(null);
        return;
      }

      const data = await res.json();
      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // origin init
  useEffect(() => {
    computeOrigin();
  }, []);

  // recompute origin on open + resize
  useEffect(() => {
    if (!isOpen) return;
    computeOrigin();
    const onResize = () => computeOrigin();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  // scroll lock
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [isOpen]);

  // 1ra carga
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) fetchUser();
  };

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-3000 bg-white isolate"
          variants={overlayVariants(originPx)}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeMenu}
        >
          <div
            className="relative h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 flex items-center 
              justify-between px-5 pt-5"
            >
  

              {/* X (arriba izq en el mock, pero acá lo dejo consistente con layout: si lo querís full izq, dime y lo invierto) */}
              <motion.button
                onClick={closeMenu}
                aria-label="Cerrar menú"
                initial={{ opacity: 0, scale: 0.95, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute left-5 top-3 p-2 rounded-md  text-black"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              className="h-full w-full px-5 pt-24 pb-8 flex flex-col"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {/* Menú principal */}
              <div className="flex-1">
                <motion.div variants={itemVariants} className="space-y-15">
                  {/* INICIO */}
                  <div className="relative pt-10 ">
                    <span className="absolute -top-4 pt-10 right-45 text-red-500 text-xs font-semibold">
                      01
                    </span>
                    <Link
                      href="/"
                      className="block text-black font-black tracking-tighter leading-none text-6xl sm:text-6xl"
                      onClick={closeMenu}
                    >
                      INICIO
                    </Link>
                  </div>

                  {/* CATALOGO */}
                  <div className="relative">
                    <span className="absolute -top-4  right-10 text-red-500 text-xs font-semibold">
                      02
                    </span>
                    <Link
                      href="/category/todos-los-productos"
                      className="block text-black font-black tracking-tighter leading-none text-6xl sm:text-6xl"
                      onClick={closeMenu}
                    >
                      CATALOGO
                    </Link>
                  </div>

                  {/* SERVICIOS */}
                  <div className="relative">
                    <span className="absolute -top-4 right-10 text-red-500 text-xs font-semibold">
                      03
                    </span>
                    <Link
                      href="/servicio"
                      className="block text-black font-black tracking-tighter leading-none text-6xl sm:text-6xl"
                      onClick={closeMenu}
                    >
                      SERVICIOS
                    </Link>
                  </div>

                  

                  {/* Auth (sin romper tu lógica; queda oculto si no hay texto) */}
                  <div className="hidden">
                    {loadingUser ? (
                      <span className="block text-black text-3xl font-semibold opacity-40" />
                    ) : user ? (
                      <ProfileSheet
                        user={user}
                        profile={profile ?? undefined}
                        onLogout={() => {
                          setUser(null);
                          setProfile(null);
                        }}
                      >
                        <button
                          className="block text-black text-3xl font-semibold"
                          type="button"
                          onClick={closeMenu}
                        />
                      </ProfileSheet>
                    ) : (
                      <LoginDialog>
                        <button
                          className="block text-black text-3xl font-semibold"
                          type="button"
                          onClick={closeMenu}
                        />
                      </LoginDialog>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Redes abajo */}
              <motion.div variants={itemVariants} className="pb-10">
                <div className="text-xs text-black/50 mb-4 pl-3">(REDES)</div>

                <div className="flex items-center justify-between text-xl px-3">
                  <Link
                    href="https://www.instagram.com/eden.3d_/"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-black font-extrabold"
                  >
                    <Instagram className="w-4 h-4" />
                    INSTAGRAM <span className="text-black/60 font-extrabold">↗</span>
                  </Link>

                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-black font-extrabold"
                  >
                    <Youtube className="w-5 h-5" />
                    YOUTUBE <span className="text-black/90  pb-2 font-extrabold"> ↗</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* botón */}
      <button
        ref={btnRef}
        onClick={handleToggle}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        className={`
          relative z-[2100]
          p-2.5 rounded-md
          duration-300
          bg-none
          ${scrolled ? "text-black" : "text-white"}
        `}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={2.5} />
          )}
        </motion.div>
      </button>

      {/* portal */}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}






