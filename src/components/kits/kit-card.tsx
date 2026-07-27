"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Kit } from "@/types/kit";

interface KitCardProps {
  kit: Kit;
}

export function KitCard({ kit }: KitCardProps) {
  const mainImage =
    kit.images.find((img) => img.isPrimary) ?? kit.images[0];
  const summary = kit.shortDescription ?? kit.description;

  return (
    <Link
      href={`/kits/${kit.slug}`}
      className="group block bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#e8a0b4]/30 transition-all duration-500 hover:bg-white/10"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#722e43]/30 to-[#9b3a5a]/20 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || kit.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <span className="text-sm font-body">Foto do kit</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold font-body backdrop-blur-sm bg-black/30 border border-white/10 text-[#e8a0b4]">
          {kit.category.name}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#e8a0b4]/0 group-hover:bg-[#e8a0b4]/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4">
        <h3 className="font-heading text-base font-bold text-white group-hover:text-[#e8a0b4] transition-colors line-clamp-1">
          {kit.name}
        </h3>
        {summary && (
          <p className="mt-1 text-xs sm:text-[13px] text-white/40 font-body line-clamp-2 leading-relaxed">
            {summary}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-heading font-bold text-[#fce8ef]">
            R$ {kit.price.toFixed(2).replace(".", ",")}
          </span>
          <span className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold font-body text-[#e8a0b4] group-hover:gap-2 transition-all duration-300 whitespace-nowrap">
            <span className="hidden sm:inline">Ver Detalhes</span>
            <span className="sm:hidden">Ver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
