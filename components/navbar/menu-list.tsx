"use client";

import localFont from "next/font/local";
import TransitionLink from "@/components/transition-link";
import {
  PRIMARY_NAV_ITEMS,
  isNavItemCurrent,
} from "@/components/navbar/navbar-config";
import { cn } from "@/lib/utils";

const desktopNavFont = localFont({
  src: "../fonts/KHInterferenceTRIAL-Light.otf",
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
                  "group relative inline-flex items-center px-3 py-2 text-[12px] tracking-[0.24em] transition-colors duration-300 xl:text-[13px]",
                  isCurrent
                    ? "text-[#C0FF01]"
                    : "text-white/80 hover:text-[#C0FF01]"
                )}
              >
                {item.label}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MenuList;
