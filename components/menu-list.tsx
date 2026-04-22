"use client";

import * as React from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const maratypeFont = localFont({
  src: "./fonts/Maratype.otf",
  display: "swap",
});

const MenuList = () => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} text-3xl font-medium tracking-wide`
            )}
          >
            <Link href="/category/todos-los-productos">CATALOGO</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} text-3xl font-medium tracking-wide`
            )}
          >
            <Link href="/servicio">SERVICIOS</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} hidden text-3xl font-medium tracking-wide`
            )}
          >
            <Link href="/cotiza">COTIZA</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;
