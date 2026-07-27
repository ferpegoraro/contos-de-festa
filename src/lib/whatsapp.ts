import { env } from "@/lib/env";
import { siteConfig } from "@/constants/site";

const FALLBACK_NUMBER = "5500000000000";

export function getWhatsAppNumber(): string {
  return env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? FALLBACK_NUMBER;
}

export function buildWhatsAppUrl(message?: string): string {
  const number = getWhatsAppNumber();
  const text = message ?? siteConfig.whatsappMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
