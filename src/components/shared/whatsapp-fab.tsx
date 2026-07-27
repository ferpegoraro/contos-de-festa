"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useIsAdminRoute } from "@/hooks/use-is-admin-route";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export function WhatsAppFab() {
  const isAdmin = useIsAdminRoute();
  if (isAdmin) return null;

  const whatsappUrl = buildWhatsAppUrl();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
    >
      <WhatsAppIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20" />
    </a>
  );
}
