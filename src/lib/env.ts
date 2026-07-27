import { z } from "zod";

const envSchema = z.object({
  /** URL completa (http://...) ou caminho relativo ("/api" — modo proxy). */
  NEXT_PUBLIC_API_URL: z
    .string()
    .refine(
      (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
      "NEXT_PUBLIC_API_URL deve ser uma URL completa ou um caminho começando com '/'.",
    )
    .default("http://localhost:3333"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d+$/, "NEXT_PUBLIC_WHATSAPP_NUMBER deve conter apenas dígitos.")
    .min(10)
    .optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined,
});

if (!parsed.success) {
  console.error(
    "❌ Variáveis de ambiente do frontend inválidas:",
    parsed.error.format(),
  );
  throw new Error("Configuração de ambiente do frontend inválida.");
}

export const env = parsed.data;
