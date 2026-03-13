"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, PartyPopper } from "lucide-react";
import { siteConfig } from "@/constants/site";

export default function Home() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#722e43] via-[#5a2435] to-[#2d1a22]" />

      {/* Marca d'água - logo no fundo */}
      <div
        className="absolute inset-0 bg-[url('/logo-transparente.png')] bg-center bg-no-repeat opacity-[0.03]"
        style={{ backgroundSize: "500px" }}
      />

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-[5%] w-96 h-96 bg-[#e8a0b4]/15 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-[5%] w-[400px] h-[400px] bg-[#e8a0b4]/10 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#9b3a5a]/15 rounded-full blur-3xl will-change-transform"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col items-center text-center pt-24 pb-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150" />
            <Image
              src="/logo-transparente.png"
              alt={siteConfig.name}
              width={220}
              height={220}
              priority
              className="relative drop-shadow-2xl"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2"
          >
            <PartyPopper className="w-4 h-4 text-[#e8a0b4]" />
            <span className="text-sm font-body text-white/90">
              {siteConfig.tagline}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight"
          >
            Transforme sua festa em um{" "}
            <span className="text-[#e8a0b4]">conto de fadas</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-lg sm:text-xl text-white/70 font-body max-w-2xl leading-relaxed"
          >
            Aluguel de kits de decoração completos para sua festa.
            <span className="text-[#e8a0b4]"> Escolha, pegue, monte </span>e
            encante todos os seus convidados!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/kits"
              className="group bg-white text-[#722e43] px-8 py-4 rounded-full text-base font-bold font-body transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <PartyPopper className="w-5 h-5" />
              Ver Nossos Kits
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
              target="_blank"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-base font-semibold font-body hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              Fale Conosco
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2d1a22] to-transparent" />
    </section>
  );
}
