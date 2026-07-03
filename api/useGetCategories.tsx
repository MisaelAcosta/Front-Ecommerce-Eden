"use client";

import { useEffect, useState } from "react";
import type { CategoryType } from "@/types/category";

type HookReturn = {
  categories: CategoryType[];
  loading: boolean;
  error: boolean;
};

type CategoryImage = {
  url: string;
  alternativeText?: string | null;
};

function normalizeMediaImage(media: any): CategoryImage | null {
  const candidate = media?.attributes ?? media;

  if (!candidate?.url) {
    return null;
  }

  return {
    url: candidate.url,
    alternativeText: candidate.alternativeText ?? null,
  };
}

function normalizeMediaList(media: any): CategoryImage[] {
  if (!media) return [];

  if (Array.isArray(media)) {
    return media
      .map((item) => normalizeMediaImage(item))
      .filter(Boolean) as CategoryImage[];
  }

  if (Array.isArray(media.data)) {
    return media.data
      .map((item: any) => normalizeMediaImage(item))
      .filter(Boolean) as CategoryImage[];
  }

  const single = normalizeMediaImage(media.data ?? media);
  return single ? [single] : [];
}

function normalizeSubcategories(raw: any): CategoryType["subcategories"] {
  if (Array.isArray(raw)) {
    return raw.map((sub: any) => ({
      id: sub.id,
      categoryName: sub.categoryName ?? "",
      slug: sub.slug ?? String(sub.id),
    }));
  }

  if (Array.isArray(raw?.data)) {
    return raw.data.map((subWrap: any) => {
      const sub = subWrap.attributes ?? subWrap;

      return {
        id: subWrap.id,
        categoryName: sub.categoryName ?? "",
        slug: sub.slug ?? String(subWrap.id),
      };
    });
  }

  return [];
}

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

        const mapped: CategoryType[] =
          json?.data?.map((rawItem: any) => {
            const item = rawItem.attributes ?? rawItem;
            const mainImages = normalizeMediaList(item.mainImage);

            return {
              id: rawItem.id,
              categoryName: item.categoryName ?? "",
              slug: item.slug ?? String(rawItem.id),
              description: item.description ?? null,
              isFeatured: item.isFeatured ?? null,
              mainImage: mainImages[0] ?? null,
              mainImages,
              subcategories: normalizeSubcategories(item.sub_categories),
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
