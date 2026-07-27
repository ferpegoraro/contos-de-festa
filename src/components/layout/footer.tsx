import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Heart, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { siteConfig, navLinks } from "@/constants/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#2d1a22] via-[#3d2832] to-[#2d1a22] text-[#e8d5cc] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e8a0b4]/50 to-transparent" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#722e43]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#e8a0b4]/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-16 pb-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand - Larger Section */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e8a0b4]/20 rounded-full blur-xl" />
                <Image
                  src="/logo-transparente.png"
                  alt={siteConfig.name}
                  width={56}
                  height={56}
                  className="relative"
                />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-white">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-[#e8a0b4] font-body">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <p className="text-base leading-relaxed text-white/70 mb-6 max-w-sm">
              {siteConfig.description}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e8a0b4]/20 border border-white/10 hover:border-[#e8a0b4]/50 flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-white/60 group-hover:text-[#e8a0b4] transition-colors" />
              </a>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 flex items-center justify-center transition-all duration-300 group"
              >
                <WhatsAppIcon className="w-5 h-5 text-white/60 group-hover:text-[#25D366] transition-colors" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-white font-semibold mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8a0b4]" />
              Navegação
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-white font-semibold mb-5 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#e8a0b4]" />
              Contato
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  </span>
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-8 h-8 rounded-lg bg-[#e8a0b4]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#e8a0b4]" />
                </span>
                {siteConfig.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} {siteConfig.name}. Todos os
              direitos reservados.
            </p>
            <p className="text-xs text-white/30 flex items-center gap-1">
              Feito com{" "}
              <Heart className="w-3 h-3 text-[#e8a0b4] fill-[#e8a0b4]" /> para
              suas festas
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
