"use client";

import Link from "next/link";
import { Boxes, ClipboardList, Package, Tags, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { MiniEmblem } from "@/components/shared/emblem";

const cards = [
  {
    href: "/admin/kits",
    label: "Kits",
    description: "Cadastre, edite ou remova kits e suas fotos.",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categorias",
    description: "Organize os kits por categoria (aniversário, casamento, ...).",
    icon: Tags,
  },
  {
    href: "/admin/kit-types",
    label: "Tipos de Kit",
    description: "Os formatos com preço e itens inclusos (Kit Básico, Kit de Mesa...).",
    icon: Boxes,
  },
  {
    href: "/admin/items",
    label: "Itens",
    description: "O catálogo de peças (arco, pano, painel...) usado pelos tipos.",
    icon: ClipboardList,
  },
];

export default function AdminHomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="block w-8 h-px bg-[#e8a0b4]/60" />
            <span className="font-body text-[10px] font-bold tracking-[0.35em] uppercase text-[#e8a0b4]/80">
              Bem-vinda
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Olá,{" "}
            <span className="italic text-[#e8a0b4]">
              {user?.name?.split(" ")[0] ?? "admin"}
            </span>
          </h1>
          <p className="text-white/55 mt-2 font-body max-w-xl">
            Gerencie o catálogo daqui. As alterações aparecem direto no site
            público.
          </p>
        </div>
        <MiniEmblem className="hidden sm:block w-20 h-20 shrink-0" />
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white/[0.04] backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#e8a0b4]/40 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e8a0b4]/15 border border-[#e8a0b4]/20 text-[#e8a0b4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white">
              {label}
            </h2>
            <p className="text-sm text-white/55 mt-1.5 font-body leading-relaxed">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold font-body text-[#e8a0b4] group-hover:gap-2.5 transition-all">
              Abrir
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
