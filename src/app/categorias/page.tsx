"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCategories } from "@/hooks/api/use-categories";
import { CategoryGridSkeleton } from "@/components/kits";
import {
  SparkleField,
  SubpageBackdrop,
  SubpageHero,
} from "@/components/shared/emblem";

export default function CategoriasPage() {
  const { categories, isLoading } = useCategories();
  return (
    <div className="relative min-h-screen bg-[#2d1a22] overflow-hidden">
      <SubpageBackdrop />
      <SparkleField className="absolute inset-x-0 top-0 h-screen z-10" />

      <div className="relative z-10">
        {/* Header */}
        <section className="pt-28 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <SubpageHero
              eyebrow="Coleções"
              title={
                <>
                  Nossas{" "}
                  <span className="italic text-[#e8a0b4]">categorias</span>
                </>
              }
              description="Navegue por tipo de evento e encontre o kit ideal"
            />
          </div>
        </section>

        {/* Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {isLoading ? (
              <CategoryGridSkeleton />
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/kits?categoria=${cat.slug}`}
                      className="group relative block overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#e8a0b4]/30 hover:bg-white/10 transition-all duration-500"
                    >
                      {/* estrela de 4 pontas no canto */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                        className="absolute top-5 right-5 w-4 h-4 text-[#e8a0b4]/40 group-hover:text-[#e8a0b4]/90 group-hover:scale-110 transition-all duration-500"
                      >
                        <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
                      </svg>
                      <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#e8a0b4] transition-colors">
                        {cat.name}
                      </h3>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold font-body text-[#e8a0b4] group-hover:gap-2.5 transition-all duration-300">
                        Ver kits
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
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
                  Estamos organizando nossas categorias. Enquanto isso, fale com
                  a gente pelo WhatsApp!
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
