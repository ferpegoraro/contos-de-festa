"use client";

import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  MessageCircle,
  PartyPopper,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Escolha seu kit",
    description:
      "Navegue pelo catálogo e encontre a decoração que combina com sua festa.",
    color: "#e8a0b4",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Monte seu orçamento",
    description:
      "Adicione quantos kits quiser e veja o valor estimado em tempo real.",
    color: "#fce8ef",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Fale pelo WhatsApp",
    description:
      "Envie seu orçamento e combinamos data, retirada e pagamento via PIX.",
    color: "#25D366",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Pegue & monte",
    description:
      "Você retira o kit, monta no local da festa e devolve depois. Simples assim.",
    color: "#e8a0b4",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-[#2d1a22] overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#722e43]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4">
            <PartyPopper className="w-4 h-4 text-[#e8a0b4]" />
            <span className="text-sm font-semibold font-body text-white/80">
              Como funciona
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
            Da escolha à festa, em{" "}
            <span className="text-[#e8a0b4]">4 passos</span>
          </h2>
          <p className="mt-4 text-base text-white/60 font-body max-w-xl mx-auto leading-relaxed">
            Sem cadastro, sem complicação. Você escolhe, a gente atende pelo
            WhatsApp e tudo acontece de forma simples.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
            >
              {/* Number watermark */}
              <span
                className="absolute top-4 right-5 font-heading font-bold text-5xl opacity-10"
                style={{ color: step.color }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 mb-5 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${step.color}1f` }}
              >
                <step.icon
                  className="w-6 h-6"
                  style={{ color: step.color }}
                />
              </div>

              <h3 className="font-heading text-lg font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/55 font-body leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
