"use client";

import useSWR, { mutate } from "swr";
import { api, ApiError } from "@/lib/api/client";
import type { Category } from "@/types/kit";

export type { Category };

const CATEGORIES_KEY = "/categories";

interface ListResponse {
  categories: Category[];
}

export function useCategories() {
  const { data, error, isLoading, mutate: revalidate } = useSWR<ListResponse>(
    CATEGORIES_KEY,
    (key: string) => api.get<ListResponse>(key),
  );

  return {
    categories: data?.categories ?? [],
    isLoading,
    error: error instanceof ApiError ? error.message : null,
    reload: () => revalidate(),
  };
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
}

export async function createCategory(input: CategoryInput) {
  const result = await api.post<{ category: Category }>("/categories", input);
  await mutate(CATEGORIES_KEY);
  return result;
}

export async function updateCategory(id: string, input: CategoryInput) {
  const result = await api.put<{ category: Category }>(`/categories/${id}`, input);
  await mutate(CATEGORIES_KEY);
  return result;
}

export async function deleteCategory(id: string) {
  await api.delete<void>(`/categories/${id}`);
  await mutate(CATEGORIES_KEY);
}
