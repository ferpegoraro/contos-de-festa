"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tags, ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/api/use-categories";

export function CategoriesGrid() {
  const { categories, isLoading, error } = useCategories();

  if (!isLoading && !error && categories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 bg-[#2d1a22] overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#722e43]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#e8a0b4]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4">
            <Tags className="w-4 h-4 text-[#e8a0b4]" />
            <span className="text-sm font-semibold font-body text-white/80">
              Categorias
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
            Tem festa pra <span className="text-[#e8a0b4]">cada momento</span>
          </h2>
          <p className="mt-4 text-base text-white/60 font-body max-w-xl mx-auto leading-relaxed">
            Escolha o tipo de evento e veja os kits disponíveis pra ele.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/kits?categoria=${cat.slug}`}
                  className="group flex flex-col h-full p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-[#e8a0b4]/40 hover:bg-white/[0.06] transition-all duration-500"
                >
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white group-hover:text-[#e8a0b4] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold font-body text-[#e8a0b4] group-hover:gap-2 transition-all duration-300">
                    Ver kits
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
