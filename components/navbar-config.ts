export type NavbarItem = {
  href: string;
  label: string;
  mobileNumber: string;
  matches: (pathname: string) => boolean;
};

// Agrupamos las reglas de rutas del navbar en un solo archivo para que
// escritorio y mobile compartan exactamente la misma logica.
export const PRIMARY_NAV_ITEMS: NavbarItem[] = [
  {
    href: "/",
    label: "INICIO",
    mobileNumber: "01",
    matches: (pathname) => pathname === "/",
  },
  {
    href: "/category/todos-los-productos",
    label: "CATALOGO",
    mobileNumber: "02",
    matches: (pathname) =>
      pathname.startsWith("/category/") || pathname.startsWith("/product"),
  },
  {
    href: "/servicio",
    label: "SERVICIOS",
    mobileNumber: "03",
    matches: (pathname) => pathname.startsWith("/servicio"),
  },
  {
    href: "/cotiza",
    label: "IMPRIME",
    mobileNumber: "04",
    matches: (pathname) => pathname.startsWith("/cotiza"),
  },
];

export function isNavItemCurrent(pathname: string, item: NavbarItem) {
  return item.matches(pathname);
}

export function getVisibleMobileNavItems(pathname: string) {
  return PRIMARY_NAV_ITEMS.filter((item) => !isNavItemCurrent(pathname, item));
}
