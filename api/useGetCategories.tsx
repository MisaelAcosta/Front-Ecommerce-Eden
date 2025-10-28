"use client";

import { useEffect, useState } from "react";
import type { CategoryType } from "@/types/category";

type HookReturn = {
  categories: CategoryType[];
  loading: boolean;
  error: boolean;
};

export const useGetCategories = (): HookReturn => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate[mainImage]=true&populate[sub_categories]=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Bad response from categories");
        }

        const json = await res.json();
        console.log("[useGetCategories] RAW json ===>", json);

        const mapped: CategoryType[] =
          json?.data?.map((item: any) => {
            // mainImage normalización
            let mainImage = null;
            if (item.mainImage?.url) {
              // estilo v5 plano
              mainImage = {
                url: item.mainImage.url,
                alternativeText: item.mainImage.alternativeText ?? null,
              };
            } else if (item.mainImage?.data?.attributes?.url) {
              // estilo v4 attributes
              mainImage = {
                url: item.mainImage.data.attributes.url,
                alternativeText:
                  item.mainImage.data.attributes.alternativeText ?? null,
              };
            }

            // subcategorías: ***OJO*** es sub_categories
            let subcategories: CategoryType["subcategories"] = [];

            if (Array.isArray(item.sub_categories)) {
              subcategories = item.sub_categories.map((sub: any) => ({
                id: sub.id,
                categoryName: sub.categoryName ?? "",
                slug: sub.slug ?? String(sub.id),
              }));
            } else if (Array.isArray(item.sub_categories?.data)) {
              // fallback en caso de formato tipo v4
              subcategories = item.sub_categories.data.map((subWrap: any) => ({
                id: subWrap.id,
                categoryName: subWrap.attributes?.categoryName ?? "",
                slug: subWrap.attributes?.slug ?? String(subWrap.id),
              }));
            }

            return {
              id: item.id,
              categoryName: item.categoryName ?? "",
              slug: item.slug ?? String(item.id),
              description: item.description ?? null,
              isFeatured: item.isFeatured ?? null,
              mainImage,
              subcategories,
            };
          }) ?? [];

        setCategories(mapped);
        setError(false);
      } catch (err) {
        console.error("[useGetCategories] ERROR ===>", err);
        setError(true);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};






