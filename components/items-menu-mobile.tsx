"use client";

import { Menu, X, Instagram, Youtube } from "lucide-react";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { LoginDialog } from "@/components/auth/login-dialog";
import { ProfileSheet } from "@/components/profile/profile-sheet";
import type { CurrentUser, ProfileData } from "@/components/profile/profile-types";
import TransitionLink from "@/components/transition-link";

const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

const khInterferenceBoldFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Bold.otf",
  weight: "700",
  style: "normal",
  display: "swap",
});

const overlayVariants = (originPx: string): Variants => ({
  initial: {
    clipPath: `circle(0px at ${originPx})`,
  },
  animate: {
    clipPath: `circle(200vmax at ${originPx})`,
    transition: {
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1],
    },
  },
  exit: {
    clipPath: `circle(0px at ${originPx})`,
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1],
    },
  },
});

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

type ItemsMenuMobileProps = {
  scrolled: boolean;
};

export default function ItemsMenuMobile({ scrolled }: ItemsMenuMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [originPx, setOriginPx] = useState("100% 0%");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    setMounted(true);
    computeOrigin();
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    computeOrigin();
    const onResize = () => computeOrigin();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

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

  const closeMenu = () => setIsOpen(false);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      fetchUser();
    }
  };

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[3000] isolate bg-white"
          variants={overlayVariants(originPx)}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={closeMenu}
        >
          <div
            className="relative h-full w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-5"
            >
              <motion.button
                onClick={closeMenu}
                aria-label="Cerrar menu"
                initial={{ opacity: 0, scale: 0.95, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute top-3 left-5 rounded-md p-2 text-black"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div
              className="flex h-full w-full flex-col px-5 pt-24 pb-8"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              <div className="flex-1">
                <motion.div variants={itemVariants} className="space-y-15">
                  <div className="relative pt-10">
                    <span className="absolute -top-4 right-45 pt-10 text-xs font-semibold text-red-500">
                      01
                    </span>
                    <TransitionLink
                      href="/"
                      className={`${maratypeFont.className} block text-8xl leading-none tracking-tighter text-black sm:text-6xl`}
                      onClick={closeMenu}
                    >
                      INICIO
                    </TransitionLink>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-4 right-10 text-xs font-semibold text-red-500">
                      02
                    </span>
                    <TransitionLink
                      href="/category/todos-los-productos"
                      className={`${maratypeFont.className} block text-8xl leading-none tracking-tighter text-black sm:text-6xl`}
                      onClick={closeMenu}
                    >
                      CATALOGO
                    </TransitionLink>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-4 right-10 text-xs font-semibold text-red-500">
                      03
                    </span>
                    <TransitionLink
                      href="/servicio"
                      className={`${maratypeFont.className} block text-8xl leading-none tracking-tighter text-black sm:text-6xl`}
                      onClick={closeMenu}
                    >
                      SERVICIOS
                    </TransitionLink>
                  </div>

                  <div className="relative">
                    <span className="absolute -top-4 right-10 text-xs font-semibold text-red-500">
                      04
                    </span>
                    <TransitionLink
                      href="/cotiza"
                      className={`${maratypeFont.className} block text-8xl leading-none tracking-tighter text-black sm:text-6xl`}
                      onClick={closeMenu}
                    >
                      IMPRIME
                    </TransitionLink>
                  </div>

                  <div className="hidden">
                    {loadingUser ? (
                      <span className="block text-3xl font-semibold text-black opacity-40" />
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
                          className="block text-3xl font-semibold text-black"
                          type="button"
                          onClick={closeMenu}
                        />
                      </ProfileSheet>
                    ) : (
                      <LoginDialog>
                        <button
                          className="block text-3xl font-semibold text-black"
                          type="button"
                          onClick={closeMenu}
                        />
                      </LoginDialog>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pb-10">
                <div className="mb-4 pl-3 text-xs text-black/50">(REDES)</div>

                <div className="flex items-center justify-between px-3 text-xl">
                  <TransitionLink
                    href="https://www.instagram.com/eden.3d_/"
                    target="_blank"
                    className={`${khInterferenceBoldFont.className} inline-flex items-center gap-2 tracking-wide text-black`}
                  >
                    <Instagram className="h-4 w-4" />
                    INSTAGRAM <span className="font-extrabold text-black/60">↗</span>
                  </TransitionLink>

                  <TransitionLink
                    href="https://youtube.com"
                    target="_blank"
                    className={`${khInterferenceBoldFont.className} inline-flex items-center gap-2 tracking-wide text-black`}
                  >
                    <Youtube className="h-5 w-5" />
                    YOUTUBE <span className="pb-2 font-extrabold text-black/90">↗</span>
                  </TransitionLink>
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
      <button
        ref={btnRef}
        onClick={handleToggle}
        aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        className={`
          relative z-[2100]
          shrink-0 rounded-md bg-none p-1.5 duration-300 sm:p-2
          ${scrolled ? "text-black" : "text-white"}
        `}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          )}
        </motion.div>
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
