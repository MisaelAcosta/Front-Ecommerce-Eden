"use client";

import * as React from "react";
import localFont from "next/font/local";
import TransitionLink from "@/components/transition-link";
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
      <NavigationMenuList className="gap-2 py-4 ">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} text-3xl font-medium 
              tracking-wide`
            )}
          >
            <TransitionLink href="/category/todos-los-productos">
              CATALOGO
            </TransitionLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} text-3xl font-medium 
              tracking-wide`
            )}
          >
            <TransitionLink href="/servicio">SERVICIOS</TransitionLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              `${maratypeFont.className} text-3xl font-medium 
              tracking-wide`
            )}
          >
            <TransitionLink href="/cotiza">IMPRIME</TransitionLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;
