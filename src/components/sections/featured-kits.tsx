"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useKits } from "@/hooks/api/use-kits";
import { KitCard, KitGridSkeleton } from "@/components/kits";

export function FeaturedKits() {
  const { kits, isLoading, error } = useKits({ featured: true, pageSize: 3 });
  const featured = useMemo(() => kits.slice(0, 3), [kits]);

  if (!isLoading && !error && featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-[#fff9f5] to-[#fbeee2] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#722e43]/5 border border-[#722e43]/10 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#722e43]" />
            <span className="text-sm font-semibold font-body text-[#722e43]">
              Em destaque
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#2d1a22]">
            Kits que estão fazendo sucesso
          </h2>
          <p className="mt-3 text-[#8c7080] font-body max-w-lg mx-auto">
            Os preferidos das nossas clientes para encantar a festa
          </p>
        </motion.div>

        <div className="rounded-3xl bg-[#2d1a22] p-6 sm:p-10">
          {isLoading ? (
            <KitGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((kit) => (
                <KitCard key={kit.id} kit={kit} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/kits"
            className="inline-flex items-center gap-2 bg-[#722e43] text-white px-6 py-3 rounded-full font-semibold font-body hover:bg-[#9b3a5a] transition-all duration-300"
          >
            Ver todos os kits
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
