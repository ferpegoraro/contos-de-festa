"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
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
          "fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between gap-3 p-6 border-b border-sidebar-border">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="relative w-11 h-11 shrink-0">
              {/* arco tracejado girando ao redor da logo */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-[#e8a0b4]/35 will-change-transform"
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
              <p className="font-heading text-base font-bold leading-tight">
                {siteConfig.name}
              </p>
              <p className="text-xs text-rosa font-body">Painel admin</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-body transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-body text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white transition-colors mt-4"
          >
            <ExternalLink className="w-4 h-4" />
            Ver site público
          </Link>
        </nav>

        {/* Footer / user */}
        <div className="p-4 border-t border-sidebar-border">
          {user && (
            <div className="px-3 pb-3">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/50 font-body truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-body text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
