"use client";

import { Fragment, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Search, X } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { KitCard, FilterPills, KitGridSkeleton } from "@/components/kits";
import {
  SparkleField,
  SubpageBackdrop,
  SubpageHero,
} from "@/components/shared/emblem";
import { useKits, type Kit } from "@/hooks/api/use-kits";
import { useCategories } from "@/hooks/api/use-categories";
import { useKitTypes } from "@/hooks/api/use-kit-types";

const ITEMS_PER_PAGE = 12;
/** Quantos kits aparecem por tipo no modo prévia (antes do "Ver todos"). */
const PREVIEW_PER_GROUP = 4;

export default function KitsPage() {
  const { kits, isLoading, error: kitsError } = useKits();
  const { categories } = useCategories();
  const { kitTypes } = useKitTypes();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return kits.filter((kit) => {
      const haystack =
        `${kit.name} ${kit.shortDescription ?? ""} ${kit.description}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesCategory =
        !activeCategory || kit.category.id === activeCategory;
      const matchesType = !activeType || kit.kitTypeId === activeType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [kits, search, activeCategory, activeType]);

  /**
   * Modo prévia: sem busca e sem tipo selecionado, mostra cada tipo como uma
   * seção curta (até PREVIEW_PER_GROUP kits) com botão "Ver todos".
   * A ordem alfabética (tipo → kit) já vem do banco.
   */
  const isPreview = !search && !activeType;

  const groups = useMemo(() => {
    if (!isPreview) return [];
    const map = new Map<string, Kit[]>();
    for (const kit of filtered) {
      const list = map.get(kit.kitTypeId) ?? [];
      list.push(kit);
      map.set(kit.kitTypeId, list);
    }
    return Array.from(map.values());
  }, [filtered, isPreview]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedKits = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setPage(1);
  };

  const handleTypeChange = (typeId: string | null) => {
    setActiveType(typeId);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="relative min-h-screen bg-[#2d1a22] overflow-hidden">
      <SubpageBackdrop />
      <SparkleField className="absolute inset-x-0 top-0 h-screen z-10" />

      <div className="relative z-10">
        {/* Header */}
        <section className="pt-28 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <SubpageHero
              eyebrow="Catálogo"
              title={
                <>
                  Nossos <span className="italic text-[#e8a0b4]">kits</span>
                </>
              }
              description="Encontre a decoração perfeita para transformar sua festa"
            />
          </div>
        </section>

        {/* Search + Filters (só aparece quando houver kits) */}
        {kits.length > 0 && (
          <section className="pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative max-w-md mx-auto"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  placeholder="Buscar kits..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white font-body placeholder:text-white/30 focus:outline-none focus:border-[#e8a0b4]/40 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>

              {/* Filtros: tipo de kit + categoria */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-3"
              >
                {kitTypes.length > 0 && (
                  <FilterPills
                    label="Tipo"
                    options={kitTypes}
                    active={activeType}
                    onChange={handleTypeChange}
                  />
                )}
                {categories.length > 0 && (
                  <FilterPills
                    label="Festa"
                    options={categories}
                    active={activeCategory}
                    onChange={handleCategoryChange}
                  />
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {isLoading ? (
              <KitGridSkeleton />
            ) : kitsError ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-body">
                  Não conseguimos carregar os kits agora.
                </p>
                <p className="text-white/40 font-body text-sm mt-2">
                  Tente novamente em instantes ou fale com a gente pelo WhatsApp.
                </p>
              </motion.div>
            ) : isPreview && groups.length > 0 ? (
              /* Modo prévia: cada tipo vira uma seção curta + "Ver todos" */
              <div className="space-y-10">
                {groups.map((group) => {
                  const kitType = group[0].kitType;
                  const hasMore = group.length > PREVIEW_PER_GROUP;
                  return (
                    <div key={kitType.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="font-body text-[11px] font-bold tracking-[0.3em] uppercase text-[#e8a0b4]">
                          {kitType.name}
                        </h2>
                        <span className="font-heading italic text-sm text-white/35">
                          R$ {kitType.price.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                        <button
                          onClick={() => handleTypeChange(kitType.id)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-body text-[#e8a0b4] hover:text-white hover:gap-2.5 transition-all whitespace-nowrap"
                        >
                          Ver todos ({group.length})
                          <span aria-hidden>→</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {group.slice(0, PREVIEW_PER_GROUP).map((kit) => (
                          <KitCard key={kit.id} kit={kit} />
                        ))}
                      </div>
                      {hasMore && (
                        <div className="mt-4 text-center sm:hidden">
                          <button
                            onClick={() => handleTypeChange(kitType.id)}
                            className="px-5 py-2 rounded-full text-sm font-semibold font-body bg-white/5 border border-white/10 text-[#e8a0b4] hover:bg-white/10 transition-colors"
                          >
                            Ver todos os {group.length} kits
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : paginatedKits.length > 0 ? (
              <>
                {/* Tipo selecionado ou busca: lista completa paginada */}
                {activeType && (
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="font-body text-[11px] font-bold tracking-[0.3em] uppercase text-[#e8a0b4]">
                      {paginatedKits[0].kitType.name}
                    </h2>
                    <span className="font-heading italic text-sm text-white/35">
                      R$ {paginatedKits[0].kitType.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                    <button
                      onClick={() => handleTypeChange(null)}
                      className="text-xs sm:text-sm font-semibold font-body text-white/50 hover:text-white transition-colors whitespace-nowrap"
                    >
                      ← Todos os tipos
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {paginatedKits.map((kit, index) => {
                    const newGroup =
                      !activeType &&
                      (index === 0 ||
                        paginatedKits[index - 1].kitType.id !== kit.kitType.id);
                    return (
                      <Fragment key={kit.id}>
                        {newGroup && (
                          <div
                            className={`col-span-full flex items-center gap-3 ${index === 0 ? "" : "mt-4"}`}
                          >
                            <span className="font-body text-[11px] font-bold tracking-[0.3em] uppercase text-[#e8a0b4]">
                              {kit.kitType.name}
                            </span>
                            <span className="font-heading italic text-sm text-white/35">
                              R$ {kit.kitType.price.toFixed(2).replace(".", ",")}
                            </span>
                            <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                          </div>
                        )}
                        <KitCard kit={kit} />
                      </Fragment>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-full text-sm font-bold font-body transition-all duration-300 ${
                          page === i + 1
                            ? "bg-[#e8a0b4]/20 border border-[#e8a0b4]/40 text-[#e8a0b4]"
                            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : kits.length > 0 && filtered.length === 0 ? (
              /* Busca sem resultado */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 font-body">
                  Nenhum kit encontrado.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory(null);
                    setActiveType(null);
                  }}
                  className="mt-4 text-sm text-[#e8a0b4] font-body hover:underline"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              /* Sem kits cadastrados */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center py-20"
              >
                <Package className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h2 className="text-2xl font-heading font-bold text-white/60 mb-2">
                  Em breve!
                </h2>
                <p className="text-white/40 font-body max-w-sm mx-auto mb-8">
                  Estamos preparando nossos kits com muito carinho. Enquanto
                  isso, fale com a gente pelo WhatsApp!
                </p>
                <Link
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold font-body hover:bg-white/20 transition-all duration-300"
                >
                  Fale Conosco
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
