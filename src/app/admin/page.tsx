"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import {
  Boxes,
  ClipboardList,
  Package,
  Tags,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useKits } from "@/hooks/api/use-kits";
import { useCategories } from "@/hooks/api/use-categories";
import { useKitTypes } from "@/hooks/api/use-kit-types";
import { useItems } from "@/hooks/api/use-items";

const MotionLink = motion.create(Link);
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Spring "Apple-ish": responde na hora e assenta sem balançar demais.
const HOVER_SPRING = { type: "spring", stiffness: 420, damping: 30, mass: 0.7 } as const;

type Card = {
  href: string;
  label: string;
  unit: string;
  description: string;
  icon: LucideIcon;
};

const cards: Card[] = [
  {
    href: "/admin/kits",
    label: "Kits",
    unit: "no catálogo",
    description: "Cadastre, edite ou remova kits e suas fotos.",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categorias",
    unit: "temas",
    description: "Organize os kits por categoria (aniversário, casamento, ...).",
    icon: Tags,
  },
  {
    href: "/admin/kit-types",
    label: "Tipos de Kit",
    unit: "formatos",
    description:
      "Os formatos com preço e itens inclusos (Kit Básico, Kit de Mesa...).",
    icon: Boxes,
  },
  {
    href: "/admin/items",
    label: "Itens",
    unit: "peças",
    description: "O catálogo de peças (arco, pano, painel...) usado pelos tipos.",
    icon: ClipboardList,
  },
];

// Container orquestra a entrada em cascata dos filhos.
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const cardEntry: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

function DashboardCard({
  card,
  count,
  loading,
}: {
  card: Card;
  count: number;
  loading: boolean;
}) {
  const Icon = card.icon;
  // Posição do cursor dentro do card → alimenta o brilho (spotlight).
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(232,160,180,0.16), transparent 62%)`;

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }
  function handleLeave() {
    mx.set(-200);
    my.set(-200);
  }

  return (
    <motion.div variants={cardEntry} className="h-full">
      <MotionLink
        href={card.href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={HOVER_SPRING}
        className="group adm-panel relative overflow-hidden p-6 flex items-center gap-4 h-full min-h-[120px]"
      >
        {/* Spotlight que segue o cursor */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        {/* Borda que acende no hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e8a0b4]/0 group-hover:border-[#e8a0b4]/45 transition-colors duration-300"
        />

        <div
          className="relative w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{
            background: "rgba(232,160,180,0.12)",
            border: "1px solid rgba(232,160,180,0.24)",
            color: "var(--rosa)",
          }}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-[#f2e8ec]">
              {card.label}
            </h2>
            <ArrowRight className="w-4 h-4 text-[#e8a0b4] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
          </div>
          <p className="text-sm text-[#bda3ac] mt-1 font-body leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Contagem viva — o dado real, no lugar da decoração */}
        <div className="relative shrink-0 text-right pl-2 w-16">
          {loading ? (
            <div className="ml-auto h-8 w-9 rounded-md bg-white/[0.06] animate-pulse" />
          ) : (
            <motion.span
              key={count}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="block font-heading text-3xl font-bold leading-none text-[#f2e8ec] tabular-nums"
            >
              {count}
            </motion.span>
          )}
          <span className="block text-[11px] text-[#8f7681] font-body mt-1">
            {card.unit}
          </span>
        </div>
      </MotionLink>
    </motion.div>
  );
}

export default function AdminHomePage() {
  const { user } = useAuth();
  const { total: kitsTotal, isLoading: kitsLoading } = useKits();
  const { categories, isLoading: catLoading } = useCategories();
  const { kitTypes, isLoading: typesLoading } = useKitTypes();
  const { items, isLoading: itemsLoading } = useItems();

  const counts: Record<string, { value: number; loading: boolean }> = {
    "/admin/kits": { value: kitsTotal, loading: kitsLoading },
    "/admin/categories": { value: categories.length, loading: catLoading },
    "/admin/kit-types": { value: kitTypes.length, loading: typesLoading },
    "/admin/items": { value: items.length, loading: itemsLoading },
  };

  // Data de hoje (init lazy — sem effect).
  const [today] = useState(() => {
    const label = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  return (
    <div className="max-w-5xl mx-auto">
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="adm-shimmer font-heading text-3xl sm:text-4xl font-bold leading-tight">
              Olá, {user?.name?.split(" ")[0] ?? "admin"}
            </h1>
            <p className="text-[#bda3ac] mt-2 font-body max-w-xl">
              Gerencie o catálogo daqui. As alterações aparecem direto no site
              público.
            </p>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <span className="inline-flex items-center gap-2 text-xs font-body text-[#bda3ac]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7ecb8f] shadow-[0_0_8px_1px_rgba(126,203,143,0.6)]" />
              Site no ar
            </span>
            <p
              suppressHydrationWarning
              className="text-sm text-[#8f7681] font-body mt-1.5 min-h-[1.25rem]"
            >
              {today}
            </p>
          </div>
        </div>
        <div className="mt-6" style={{ borderBottom: "1px solid var(--line)" }} />
      </motion.header>

      <motion.div
        className="grid sm:grid-cols-2 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {cards.map((card) => (
          <DashboardCard
            key={card.href}
            card={card}
            count={counts[card.href].value}
            loading={counts[card.href].loading}
          />
        ))}
      </motion.div>
    </div>
  );
}
