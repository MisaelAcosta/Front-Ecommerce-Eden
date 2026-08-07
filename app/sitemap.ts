import type { MetadataRoute } from "next";

const siteUrl = "https://www.eden3d.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/category/todos-los-productos",
    "/category/libros",
    "/category/soporte",
    "/category/geek",
    "/servicio",
    "/cotiza",
    "/explora",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
