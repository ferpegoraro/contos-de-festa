"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Sparkle — estrela de 4 pontas piscando                              */
/* ------------------------------------------------------------------ */

export function Sparkle({
  className,
  delay,
  duration,
}: {
  className: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.15, 0.7] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* SparkleField — brilhos espalhados pela cena                         */
/* ------------------------------------------------------------------ */

export function SparkleField({
  className = "absolute inset-0 z-10",
}: {
  className?: string;
}) {
  return (
    <div className={`pointer-events-none hidden sm:block ${className}`}>
      <Sparkle className="top-[18%] left-[14%] w-4 h-4 text-[#e8a0b4]/70" delay={0.4} duration={5} />
      <Sparkle className="top-[12%] right-[20%] w-3 h-3 text-[#fce8ef]/60" delay={1.8} duration={4.2} />
      <Sparkle className="top-[42%] left-[7%] w-2.5 h-2.5 text-[#fce8ef]/50" delay={2.6} duration={5.5} />
      <Sparkle className="top-[38%] right-[8%] w-3.5 h-3.5 text-[#e8a0b4]/60" delay={0.9} duration={4.6} />
      <Sparkle className="bottom-[24%] left-[18%] w-3 h-3 text-[#e8a0b4]/50" delay={3.2} duration={5.2} />
      <Sparkle className="bottom-[18%] right-[15%] w-4 h-4 text-[#fce8ef]/55" delay={1.4} duration={4.8} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SubpageBackdrop — mesma atmosfera da home, versão mais escura       */
/* gradiente + glows + grão de papel + vinheta                         */
/* ------------------------------------------------------------------ */

export function SubpageBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#5a2435] via-[#3d2832] to-[#2d1a22]" />

      <motion.div
        className="absolute -top-40 -right-32 w-[520px] h-[520px] bg-[#9b3a5a]/20 rounded-full blur-3xl will-change-transform"
        animate={{ y: [0, 30, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-32 w-[560px] h-[560px] bg-[#e8a0b4]/10 rounded-full blur-3xl will-change-transform"
        animate={{ y: [0, -26, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* grão fino tipo papel */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      {/* vinheta */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MiniEmblem — versão compacta do selo da home                        */
/* logo + anel tracejado girando + ponto orbitando + halo              */
/* ------------------------------------------------------------------ */

export function MiniEmblem({
  className = "w-24 h-24",
}: {
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      {/* halo */}
      <motion.div
        className="absolute inset-[10%] rounded-full bg-[#e8a0b4]/20 blur-xl will-change-transform"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* anel tracejado girando */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-[#e8a0b4]/30 will-change-transform"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* anel interno fixo */}
      <div className="absolute inset-[9%] rounded-full border border-white/10" />

      {/* ponto orbitando */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 -translate-x-1/2 -top-[2px] w-1 h-1 rounded-full bg-[#e8a0b4] shadow-[0_0_8px_2px_rgba(232,160,180,0.5)]" />
      </motion.div>

      {/* logo levitando */}
      <motion.div
        className="absolute inset-[16%] flex items-center justify-center will-change-transform"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/logo-transparente.png"
          alt=""
          width={120}
          height={120}
          className="w-full h-auto drop-shadow-[0_8px_18px_rgba(45,26,34,0.6)]"
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SubpageHero — cabeçalho padrão das subpáginas públicas              */
/* mini selo + eyebrow entre fios + título Playfair                    */
/* ------------------------------------------------------------------ */

export function SubpageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <MiniEmblem className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6" />

      <div className="flex items-center justify-center gap-4">
        <span className="block w-10 h-px bg-gradient-to-r from-transparent to-[#e8a0b4]/60" />
        <p className="font-body text-[11px] font-bold tracking-[0.4em] uppercase text-[#e8a0b4]">
          {eyebrow}
        </p>
        <span className="block w-10 h-px bg-gradient-to-l from-transparent to-[#e8a0b4]/60" />
      </div>

      <h1 className="mt-4 font-heading text-4xl sm:text-5xl font-bold text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-3 text-white/55 font-body max-w-lg mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
