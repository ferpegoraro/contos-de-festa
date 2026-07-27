"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, PartyPopper } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Sparkle, SparkleField } from "@/components/shared/emblem";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export default function Home() {
  return (
    <div className="bg-[#2d1a22]">
      <section className="relative min-h-screen overflow-hidden">
        <Backdrop />
        <SparkleField />

        <div className="relative z-10 container mx-auto max-w-5xl px-6 sm:px-8 min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-16">
          <LogoEmblem />
          <Tagline />
          <Ctas />
        </div>

        <ScrollHint />

        {/* fade pra próxima sessão se vier */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2d1a22] to-transparent pointer-events-none" />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

function Backdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#722e43] via-[#5a2435] to-[#2d1a22]" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -bottom-40 -left-32 w-[560px] h-[560px] bg-[#e8a0b4]/15 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, -30, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-40 -right-32 w-[520px] h-[520px] bg-[#9b3a5a]/25 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, 35, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* grão fino tipo papel */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      {/* vinheta — escurece bordas pro foco ir ao centro */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Emblema da logo — protagonista central                              */
/* Selo premium: anéis concêntricos, texto circular girando,           */
/* brilhos e logo levitando.                                           */
/* ------------------------------------------------------------------ */

function LogoEmblem() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
      className="relative w-[330px] h-[330px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] xl:w-[580px] xl:h-[580px]"
    >
      {/* halo de luz atrás do selo */}
      <motion.div
        className="absolute inset-[12%] rounded-full bg-[#e8a0b4]/20 blur-3xl will-change-transform"
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* anel externo — texto circular girando devagar */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
          <defs>
            <path
              id="emblem-circle"
              d="M 100,100 m -86,0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0"
            />
          </defs>
          <text
            className="font-body fill-white/30 uppercase"
            style={{ fontSize: "7.5px", letterSpacing: "0.42em" }}
          >
            <textPath href="#emblem-circle">
              Contos de Festas · Pegue &amp; Monte · Contos de Festas · Pegue
              &amp; Monte ·
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* anel tracejado — gira ao contrário */}
      <motion.div
        className="absolute inset-[9%] rounded-full border border-dashed border-[#e8a0b4]/25 will-change-transform"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      {/* anel interno fixo com hairline */}
      <div className="absolute inset-[16%] rounded-full border border-white/10" />

      {/* disco de vidro atrás da logo */}
      <div className="absolute inset-[19%] rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]" />

      {/* ponto orbitando o anel tracejado */}
      <motion.div
        className="absolute inset-[9%] will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-1.5 h-1.5 rounded-full bg-[#e8a0b4] shadow-[0_0_12px_3px_rgba(232,160,180,0.55)]" />
      </motion.div>

      {/* logo levitando */}
      <motion.div
        className="absolute inset-[24%] flex items-center justify-center will-change-transform"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/logo-transparente.png"
          alt="Contos de Festas"
          width={460}
          height={460}
          priority
          className="w-full h-auto drop-shadow-[0_20px_45px_rgba(45,26,34,0.65)]"
        />
      </motion.div>

      {/* brilhos — estrelas de 4 pontas piscando */}
      <Sparkle className="top-[8%] right-[14%] w-5 h-5 text-[#fce8ef]" delay={0} duration={3.2} />
      <Sparkle className="bottom-[16%] left-[6%] w-4 h-4 text-[#e8a0b4]" delay={1.1} duration={4} />
      <Sparkle className="top-[30%] left-[2%] w-3 h-3 text-[#fce8ef]/80" delay={2} duration={3.6} />
      <Sparkle className="bottom-[6%] right-[24%] w-3.5 h-3.5 text-[#e8a0b4]/90" delay={0.6} duration={4.4} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Tagline — apoio discreto sob o emblema                              */
/* ------------------------------------------------------------------ */

function Tagline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      className="mt-8"
    >
      <h1 className="sr-only">
        Contos de Festas — aluguel de kits de decoração para festas
      </h1>

      <div className="flex items-center justify-center gap-4">
        <span className="block w-10 h-px bg-gradient-to-r from-transparent to-[#e8a0b4]/60" />
        <p className="font-body text-[11px] font-bold tracking-[0.4em] uppercase text-[#e8a0b4]">
          Pegue &amp; Monte
        </p>
        <span className="block w-10 h-px bg-gradient-to-l from-transparent to-[#e8a0b4]/60" />
      </div>

      <p className="mt-5 max-w-md mx-auto text-white/65 font-body leading-[1.7] text-sm sm:text-base">
        Aluguel de kits completos de decoração no sistema{" "}
        <span className="text-white">pegue &amp; monte</span>: você escolhe,
        retira, <span className="text-white">monta você mesmo</span> no local e
        devolve depois.
      </p>

      <p className="mt-4 max-w-md mx-auto text-white/50 font-body leading-[1.6] text-xs sm:text-sm">
        <span className="text-[#e8a0b4] font-semibold">
          Não fazemos a montagem no local
        </span>{" "}
        — os kits são pensados pra você montar de um jeito fácil, sem
        complicação.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CTAs                                                                */
/* ------------------------------------------------------------------ */

function Ctas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="mt-9 flex flex-col sm:flex-row gap-4"
    >
      <Link
        href="/kits"
        className="group relative overflow-hidden bg-white text-[#722e43] hover:text-[#2d1a22] px-7 py-4 rounded-full text-sm font-bold font-body tracking-wide transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-[0_15px_40px_-10px_rgba(232,160,180,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(232,160,180,0.75)] hover:scale-[1.02]"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#e8a0b4] to-[#9b3a5a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative flex items-center gap-2">
          <PartyPopper className="w-4 h-4" />
          Explorar Catálogo
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
      <Link
        href={buildWhatsAppUrl()}
        target="_blank"
        className="group bg-white/[0.04] backdrop-blur-sm border border-white/15 text-white/90 hover:bg-white/[0.08] hover:border-white/25 hover:text-white px-7 py-4 rounded-full text-sm font-semibold font-body tracking-wide transition-all duration-300 inline-flex items-center justify-center gap-2"
      >
        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
        Conversar no WhatsApp
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll hint — apenas dica visual no rodapé                          */
/* ------------------------------------------------------------------ */

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="hidden lg:flex absolute bottom-12 right-12 z-20 flex-col items-center gap-3 text-white/40"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="w-4 h-4" />
      </motion.div>
      <span className="font-body text-[9px] font-bold tracking-[0.4em] uppercase [writing-mode:vertical-rl] rotate-180">
        Explore
      </span>
    </motion.div>
  );
}
