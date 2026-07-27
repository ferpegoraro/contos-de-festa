"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/constants/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#2d1a22]/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/40 transition-all duration-300" />
              <Image
                src="/logo-transparente.png"
                alt={siteConfig.name}
                width={48}
                height={48}
                className="relative drop-shadow-lg"
              />
            </div>
            <span className="hidden sm:block font-heading text-xl font-bold text-white drop-shadow-md">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium font-body px-4 py-2 transition-all duration-300 group",
                    isActive ? "text-white" : "text-white/90 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#e8a0b4] transition-all duration-300 rounded-full",
                      isActive ? "w-3/4" : "w-0 group-hover:w-3/4",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center">
            <Link
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden bg-white text-[#722e43] px-6 py-2.5 rounded-full text-sm font-bold font-body transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-white/25 hover:shadow-white/50 hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              Fale Conosco
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-out bg-[#2d1a22]/98 backdrop-blur-lg border-t border-white/5",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium font-body text-white/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-white/10">
            <Link
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-white text-[#722e43] px-6 py-3.5 rounded-full text-base font-bold font-body shadow-lg"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              Fale Conosco
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
