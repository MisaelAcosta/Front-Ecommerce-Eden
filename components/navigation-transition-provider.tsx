"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type NavigationTransitionContextValue = {
  navigateWithTransition: (href: string) => void;
  shouldAnimateHref: (href: string) => boolean;
};

const NavigationTransitionContext =
  createContext<NavigationTransitionContextValue | null>(null);

  // Ajusta esta config para cambiar el look de la transicion sin tocar la logica.
const TRANSITION_CONFIG = {
  desktop: {
    rows: 12,
    columns: 18,
  },
  mobile: {
    rows: 14,
    columns: 6,
  },
  pixelColor: "#FF0000",
  exitCellDuration: 0.16,
  enterCellDuration: 0.16,
  staggerEach: 0.035,
};


// Deja aqui las secciones que deben participar en la transicion.
const ROUTE_PREFIXES = ["/", "/category", "/servicio", "/cotiza"] as const;

function normalizeHref(href: string) {
  if (!href) return href;

  const [withoutHash] = href.split("#");
  const [pathname] = withoutHash.split("?");
  return pathname || "/";
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

function shouldAnimatePath(pathname: string) {
  return ROUTE_PREFIXES.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname.startsWith(prefix)
  );
}

export function NavigationTransitionProvider({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const [gridConfig, setGridConfig] = useState(TRANSITION_CONFIG.desktop);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<HTMLDivElement[]>([]);
  const pendingHrefRef = useRef<string | null>(null);
  const isAnimatingRef = useRef(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const updateGrid = () => {
      const isMobile = window.innerWidth < 768;

      setGridConfig(
        isMobile ? TRANSITION_CONFIG.mobile : TRANSITION_CONFIG.desktop
      );
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);

    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const cellCount = gridConfig.rows * gridConfig.columns;

  const cells = useMemo(() => {
    cellRefs.current = [];
    return Array.from({ length: cellCount });
  }, [cellCount]);

  const setCellRef = useCallback((element: HTMLDivElement | null, index: number) => {
    if (element) {
      cellRefs.current[index] = element;
    }
  }, []);

  const animateExit = useCallback(
  (onComplete: () => void) => {
    const overlay = overlayRef.current;
    const pixels = cellRefs.current.filter(Boolean);

    if (!overlay || pixels.length === 0) {
      onComplete();
      return;
    }

    gsap.killTweensOf([overlay, ...pixels]);
    gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
    gsap.set(pixels, { autoAlpha: 0, scale: 1 });

    gsap.to(pixels, {
      autoAlpha: 1,
      duration: TRANSITION_CONFIG.exitCellDuration,
      ease: "none",
      stagger: {
        each: TRANSITION_CONFIG.staggerEach,
        from: "random",
        grid: [gridConfig.rows, gridConfig.columns],
      },
      onComplete,
    });
  },
  [gridConfig]
);

  const animateEnter = useCallback(() => {
  const overlay = overlayRef.current;
  const pixels = cellRefs.current.filter(Boolean);

  if (!overlay || pixels.length === 0) {
    isAnimatingRef.current = false;
    return;
  }

  gsap.killTweensOf([overlay, ...pixels]);
  gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });

  gsap.to(pixels, {
    autoAlpha: 0,
    duration: TRANSITION_CONFIG.enterCellDuration,
    ease: "none",
    stagger: {
      each: TRANSITION_CONFIG.staggerEach,
      from: "random",
      grid: [gridConfig.rows, gridConfig.columns],
    },
    onComplete: () => {
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      isAnimatingRef.current = false;
    },
  });
}, [gridConfig]);

  const shouldAnimateHref = useCallback(
    (href: string) => shouldAnimatePath(pathname) || shouldAnimatePath(normalizeHref(href)),
    [pathname]
  );

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (!href || isExternalHref(href)) {
        router.push(href);
        return;
      }

      const nextPath = normalizeHref(href);

      if (!nextPath || nextPath === pathname) {
        return;
      }

      if (isAnimatingRef.current) {
        return;
      }

      if (!shouldAnimateHref(nextPath)) {
        router.push(href);
        return;
      }

      // Cubrimos la pantalla antes de navegar para que el cambio de pagina
      // ocurra "debajo" del overlay pixelado.
      isAnimatingRef.current = true;
      pendingHrefRef.current = nextPath;

      animateExit(() => {
        router.push(href);
      });
    },
    [animateExit, pathname, router, shouldAnimateHref]
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const pixels = cellRefs.current.filter(Boolean);

    if (!overlay || pixels.length === 0) {
      return;
    }

    gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(pixels, { autoAlpha: 0, scale: 1 });
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!pendingHrefRef.current) {
      return;
    }

    pendingHrefRef.current = null;
    animateEnter();
  }, [animateEnter, pathname]);

  const value = useMemo(
    () => ({
      navigateWithTransition,
      shouldAnimateHref,
    }),
    [navigateWithTransition, shouldAnimateHref]
  );

  return (
    <NavigationTransitionContext.Provider value={value}>
      {children}

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
      >
        <div
          className="grid h-full w-full"
          style={{
           gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
           gridTemplateRows: `repeat(${gridConfig.rows}, minmax(0, 1fr))`,          }}
        >
          {/* Cada celda es un "pixel" animado por GSAP. */}
          {cells.map((_, index) => (
            <div
              key={index}
              ref={(element) => setCellRef(element, index)}
              style={{ backgroundColor: TRANSITION_CONFIG.pixelColor }}
            />
          ))}
        </div>
      </div>
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);

  if (!context) {
    throw new Error(
      "useNavigationTransition must be used inside NavigationTransitionProvider"
    );
  }

  return context;
}
