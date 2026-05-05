"use client";

import localFont from "next/font/local";
import TransitionLink from "@/components/transition-link";
import {
  PRIMARY_NAV_ITEMS,
  isNavItemCurrent,
} from "@/components/navbar-config";
import { cn } from "@/lib/utils";

const desktopNavFont = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
  display: "swap",
});

type MenuListProps = {
  pathname: string;
};

const MenuList = ({ pathname }: MenuListProps) => {
  return (
    <nav aria-label="Navegacion principal del escritorio">
      <ul className="flex flex-wrap items-center gap-2 xl:gap-3">
        {PRIMARY_NAV_ITEMS.filter((item) => item.href !== "/").map((item) => {
          const isCurrent = isNavItemCurrent(pathname, item);

          return (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                className={cn(
                  desktopNavFont.className,
                  "group relative inline-flex items-center rounded-full px-3 py-2 text-[12px] tracking-[0.24em] transition-all duration-300 xl:text-[13px]",
                  isCurrent
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-1 h-px origin-left bg-white/70 transition-transform duration-300",
                    isCurrent
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MenuList;
