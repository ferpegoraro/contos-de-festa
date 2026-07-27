"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Package,
  ListChecks,
} from "lucide-react";
import { ImageCarousel, KitCard, KitGridSkeleton } from "@/components/kits";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useQuote } from "@/contexts/quote-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useKitBySlug, useKits } from "@/hooks/api/use-kits";

export default function KitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { kit, isLoading } = useKitBySlug(slug);
  const { kits: allKits } = useKits();
  const relatedKits = useMemo(() => {
    if (!kit) return [];
    return allKits
      .filter((k) => k.id !== kit.id && k.categoryId === kit.category.id)
      .slice(0, 3);
  }, [kit, allKits]);
  const { addItem, isInQuote } = useQuote();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2d1a22] via-[#3d2832] to-[#2d1a22]">
        <div className="relative pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <KitGridSkeleton />
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2d1a22] via-[#3d2832] to-[#2d1a22]">
        <div className="relative pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <Package className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold text-white/60 mb-2">
              Kit não encontrado
            </h1>
            <p className="text-white/40 font-body mb-8">
              Este kit não existe ou ainda não foi cadastrado.
            </p>
            <Link
              href="/kits"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold font-body hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Kits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inQuote = isInQuote(kit.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1a22] via-[#3d2832] to-[#2d1a22]">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#722e43]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#e8a0b4]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Back link */}
        <div className="pt-28 pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Link
              href="/kits"
              className="inline-flex items-center gap-2 text-sm text-white/40 font-body hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Kits
            </Link>
          </div>
        </div>

        {/* Kit detail */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ImageCarousel images={kit.images} kitName={kit.name} />
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col"
              >
                {/* Category */}
                <span className="inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-semibold font-body bg-[#e8a0b4]/15 border border-[#e8a0b4]/30 text-[#e8a0b4] mb-4">
                  {kit.category.name}
                </span>

                {/* Name */}
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
                  {kit.name}
                </h1>

                {/* Price */}
                <p className="mt-4 text-3xl font-heading font-bold text-[#fce8ef]">
                  R$ {kit.price.toFixed(2).replace(".", ",")}
                </p>

                {/* Description — opcional */}
                {kit.description && (
                  <p className="mt-6 text-white/60 font-body leading-relaxed">
                    {kit.description}
                  </p>
                )}

                {/* Items included — herdados do tipo do kit */}
                {kit.kitType.items.length > 0 && (
                  <div className="mt-8">
                    <h3 className="flex items-center gap-2 font-heading font-semibold text-white mb-4">
                      <ListChecks className="w-5 h-5 text-[#e8a0b4]" />
                      Itens inclusos
                    </h3>
                    <ul className="space-y-2">
                      {kit.kitType.items.map((item, index) => (
                        <li
                          key={`${item.name}-${index}`}
                          className="flex items-center gap-3 text-sm text-white/60 font-body"
                        >
                          <Check className="w-4 h-4 text-[#e8a0b4] flex-shrink-0" />
                          <span>
                            {item.name}
                            {item.quantity != null && (
                              <span className="text-white/35"> ×{item.quantity}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addItem(kit)}
                    disabled={inQuote}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-bold font-body transition-all duration-300 ${
                      inQuote
                        ? "bg-white/10 border border-white/20 text-white/50 cursor-default"
                        : "bg-[#722e43] text-white hover:bg-[#9b3a5a] hover:scale-[1.02] shadow-lg shadow-[#722e43]/20"
                    }`}
                  >
                    {inQuote ? (
                      <>
                        <Check className="w-5 h-5" />
                        No Orçamento
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Adicionar ao Orçamento
                      </>
                    )}
                  </button>

                  <a
                    href={buildWhatsAppUrl(`Olá! Tenho interesse no ${kit.name}. Poderia me passar mais informações?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-bold font-body bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#25D366]/20"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Perguntar no WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related kits */}
        {relatedKits.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              <h2 className="text-2xl font-heading font-bold text-white mb-8">
                Kits Relacionados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {relatedKits.slice(0, 3).map((related) => (
                  <KitCard key={related.id} kit={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
