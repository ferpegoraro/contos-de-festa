"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/constants/site";

export function WhatsAppFab() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
    >
      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20" />
    </a>
  );
}
