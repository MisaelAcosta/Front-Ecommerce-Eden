"use client";

import { Menu, X, Instagram } from "lucide-react";
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

//scroller
    type ItemsMenuMobileProps = {
    scrolled: boolean;
  };

export default function ItemsMenuMobile({ scrolled }: ItemsMenuMobileProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [originPx, setOriginPx] = useState("100% 0%");
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // ✅ portal mount (HOOKS DENTRO DEL COMPONENTE)
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
          className="fixed inset-0 z-[3000] bg-white isolate"
          variants={overlayVariants(originPx)}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeMenu}
        >
          <div
            className="relative h-full w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

           {/* ✅ botón animado (se mantiene) */}
          <motion.button
          onClick={closeMenu}
          aria-label="Cerrar menú"
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: -10 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="
          fixed top-6 right-5 z-[3100]
          p-2.5 rounded-md
          bg-white 
          text-black
          "
        >
          <X className="w-6 h-6" />
        </motion.button>

            <motion.div
              className="text-center w-full space-y-8 px-8"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div className="mb-20" variants={itemVariants}>
                <h2 className="text-black text-6xl font-black mb-2">Eden</h2>
                <p className="text-gray-400 text-sm">Navegación</p>
              </motion.div>

              <motion.div className="space-y-8">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/category/todos-los-productos"
                    className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2"
                    onClick={closeMenu}
                  >
                    CATALOGO
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    href="/servicio"
                    className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2"
                    onClick={closeMenu}
                  >
                    SERVICIOS
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link
                    href="/favoritos"
                    className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2"
                    onClick={closeMenu}
                  >
                    FAVORITOS
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-center">
                  {loadingUser ? (
                    <span className="block text-black text-3xl font-semibold opacity-40">
                     
                    </span>
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
                        className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2"
                        type="button"
                        onClick={closeMenu}
                      >
                        
                      </button>
                    </ProfileSheet>
                  ) : (
                    <LoginDialog>
                      <button
                        className="block text-black text-3xl font-semibold hover:text-gray-300 transform hover:translate-x-2"
                        type="button"
                        onClick={closeMenu}
                      >
                        
                      </button>
                    </LoginDialog>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-16 pt-8 flex items-center justify-center"
                variants={itemVariants}
              >
                <Link
                  href="https://instagram.com/tuusuario"
                  target="_blank"
                  className="flex items-center gap-2 bg-black px-3 py-1 rounded-full text-white text-sm hover:bg-black/90 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Link>
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
    ${scrolled ? "  text-black  20" : "text-white "}
  `}
>
  <motion.div
    initial={false}
    animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
  >
    {isOpen ? <X className="w-5 h-5"  /> : <Menu className="w-6 h-6" strokeWidth={2.5} />}
  </motion.div>
</button>

      {/* portal */}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}






