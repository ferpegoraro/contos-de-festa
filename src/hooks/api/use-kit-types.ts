"use client";

import useSWR, { mutate } from "swr";
import { api, ApiError } from "@/lib/api/client";
import type { KitType } from "@/types/kit";

export type { KitType };

const KIT_TYPES_KEY = "/kit-types";

interface ListResponse {
  kitTypes: KitType[];
}

export function useKitTypes() {
  const { data, error, isLoading, mutate: revalidate } = useSWR<ListResponse>(
    KIT_TYPES_KEY,
    (key: string) => api.get<ListResponse>(key),
  );

  return {
    kitTypes: data?.kitTypes ?? [],
    isLoading,
    error: error instanceof ApiError ? error.message : null,
    reload: () => revalidate(),
  };
}

export interface KitTypeInput {
  name: string;
  slug?: string;
  price: number;
  /** Itens do catálogo inclusos — no update, substitui a lista inteira. */
  items?: { itemId: string; quantity?: number | null }[];
}

export async function createKitType(input: KitTypeInput) {
  const result = await api.post<{ kitType: KitType }>("/kit-types", input);
  await mutate(KIT_TYPES_KEY);
  return result;
}

export async function updateKitType(id: string, input: KitTypeInput) {
  const result = await api.put<{ kitType: KitType }>(`/kit-types/${id}`, input);
  await mutate(KIT_TYPES_KEY);
  return result;
}

export async function deleteKitType(id: string) {
  await api.delete<void>(`/kit-types/${id}`);
  await mutate(KIT_TYPES_KEY);
}
