"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ClipboardList,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { siteConfig } from "@/constants/site";

const navItems = [
  { href: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/admin/kits", label: "Kits", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tags },
  { href: "/admin/kit-types", label: "Tipos de Kit", icon: Boxes },
  { href: "/admin/items", label: "Itens", icon: ClipboardList },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-72 flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          background: "#1a1015",
          borderRight: "1px solid var(--line)",
        }}
      >
        {/* Logo + close */}
        <div
          className="flex items-center justify-between gap-3 p-6"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="relative w-11 h-11 shrink-0">
              {/* arco tracejado girando ao redor da logo */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-[#e8a0b4]/30 will-change-transform"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <Image
                src="/logo-transparente.png"
                alt={siteConfig.name}
                width={36}
                height={36}
                className="absolute inset-0 m-auto w-8 h-8"
              />
            </div>
            <div>
              <p className="font-heading text-base font-bold leading-tight text-[#f2e8ec]">
                {siteConfig.name}
              </p>
              <p className="text-xs text-[#8f7681] font-body mt-0.5">Painel</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-[#bda3ac] hover:bg-white/5"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-body transition-colors",
                  isActive
                    ? "text-white"
                    : "text-[#bda3ac] hover:bg-white/[0.04] hover:text-[#f2e8ec]",
                )}
                style={
                  isActive
                    ? {
                        background: "rgba(232,160,180,0.12)",
                        boxShadow: "inset 2px 0 0 var(--rosa)",
                      }
                    : undefined
                }
              >
                <Icon
                  className={cn("w-4 h-4", isActive && "text-[#e8a0b4]")}
                />
                {label}
              </Link>
            );
          })}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-body text-[#8f7681] hover:bg-white/[0.04] hover:text-[#f2e8ec] transition-colors mt-3"
          >
            <ExternalLink className="w-4 h-4" />
            Ver site público
          </Link>
        </nav>

        {/* Footer / user */}
        <div className="p-4" style={{ borderTop: "1px solid var(--line)" }}>
          {user && (
            <div className="px-3 pb-3">
              <p className="text-sm font-semibold text-[#f2e8ec] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[#8f7681] font-body truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium font-body text-[#bda3ac] hover:bg-white/[0.04] hover:text-[#f2e8ec] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
