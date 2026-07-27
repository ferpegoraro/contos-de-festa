"use client";

import useSWR, { mutate } from "swr";
import { api, ApiError } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Kit, KitImage } from "@/types/kit";

export type { Kit, KitImage };

interface ListResponse {
  kits: Kit[];
  total: number;
  page: number;
  pageSize: number;
}

export interface KitInput {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string | null;
  /** Preço promocional — null/ausente herda o preço do tipo. */
  priceOverride?: number | null;
  featured?: boolean;
  kitTypeId: string;
  categoryId: string;
}

export interface KitsFilters {
  type?: string;
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

function kitsKey(filters?: KitsFilters): string {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.featured !== undefined) {
    params.set("featured", String(filters.featured));
  }
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));
  const qs = params.toString();
  return qs ? `/kits?${qs}` : "/kits";
}

export function useKits(filters?: KitsFilters) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<ListResponse>(
    kitsKey(filters),
    (key: string) => api.get<ListResponse>(key),
  );

  return {
    kits: data?.kits ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 24,
    isLoading,
    error: error instanceof ApiError ? error.message : null,
    reload: () => revalidate(),
  };
}

export function useKitBySlug(slug: string | null) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<{ kit: Kit }>(
    slug ? `/kits/${slug}` : null,
    (key: string) => api.get<{ kit: Kit }>(key),
  );

  return {
    kit: data?.kit ?? null,
    isLoading,
    error: error instanceof ApiError ? error.message : null,
    reload: () => revalidate(),
  };
}

async function invalidateKits() {
  await mutate(
    (key) => typeof key === "string" && key.startsWith("/kits"),
    undefined,
    { revalidate: true },
  );
}

export async function createKit(input: KitInput) {
  const result = await api.post<{ kit: Kit }>("/kits", input);
  await invalidateKits();
  return result;
}

export async function updateKit(id: string, input: Partial<KitInput>) {
  const result = await api.put<{ kit: Kit }>(`/kits/${id}`, input);
  await invalidateKits();
  return result;
}

export async function deleteKit(id: string) {
  await api.delete<void>(`/kits/${id}`);
  await invalidateKits();
}

export async function uploadKitImage(
  kitId: string,
  file: File,
  options: { alt?: string; isPrimary?: boolean } = {},
) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  if (options.alt) formData.append("alt", options.alt);
  if (options.isPrimary) formData.append("isPrimary", "true");

  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/kits/${kitId}/images`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }
  const result = (await response.json()) as { image: KitImage };
  await invalidateKits();
  return result;
}

export async function deleteKitImage(kitId: string, imageId: string) {
  await api.delete<void>(`/kits/${kitId}/images/${imageId}`);
  await invalidateKits();
}

export async function reorderKitImages(
  kitId: string,
  items: { id: string; order: number; isPrimary?: boolean }[],
) {
  const result = await api.put<{ images: KitImage[] }>(
    `/kits/${kitId}/images/reorder`,
    { items },
  );
  await invalidateKits();
  return result;
}
