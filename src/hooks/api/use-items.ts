"use client";

import useSWR, { mutate } from "swr";
import { api, ApiError } from "@/lib/api/client";
import type { Item } from "@/types/kit";

export type { Item };

const ITEMS_KEY = "/items";

interface ListResponse {
  items: Item[];
}

export function useItems() {
  const { data, error, isLoading, mutate: revalidate } = useSWR<ListResponse>(
    ITEMS_KEY,
    (key: string) => api.get<ListResponse>(key),
  );

  return {
    items: data?.items ?? [],
    isLoading,
    error: error instanceof ApiError ? error.message : null,
    reload: () => revalidate(),
  };
}

export interface ItemInput {
  name: string;
}

export async function createItem(input: ItemInput) {
  const result = await api.post<{ item: Item }>(ITEMS_KEY, input);
  await mutate(ITEMS_KEY);
  return result;
}

export async function updateItem(id: string, input: ItemInput) {
  const result = await api.put<{ item: Item }>(`/items/${id}`, input);
  await mutate(ITEMS_KEY);
  return result;
}

export async function deleteItem(id: string) {
  await api.delete<void>(`/items/${id}`);
  await mutate(ITEMS_KEY);
}
