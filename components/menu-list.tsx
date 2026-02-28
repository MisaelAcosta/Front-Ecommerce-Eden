"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // ✅ importante

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const MenuList = () => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-2 ">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "text-lg font-medium  tracking-wide"
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
              "text-lg font-medium tracking-wide"
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
              "text-lg font-medium hidden  tracking-wide"
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

