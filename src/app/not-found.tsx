import Link from "next/link";
import { Home, Search } from "lucide-react";
import { siteConfig } from "@/constants/site";

export const metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#722e43] via-[#5a2435] to-[#2d1a22] flex items-center justify-center px-4">
      <div className="relative z-10 max-w-lg w-full text-center">
        <p className="font-heading text-[#e8a0b4] text-7xl sm:text-8xl font-bold leading-none">
          404
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-heading font-bold text-white">
          Essa página sumiu na confeitaria
        </h1>
        <p className="mt-4 text-white/70 font-body">
          O endereço que você acessou não existe ou foi movido. Que tal voltar
          para a página inicial ou conferir os kits?
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#722e43] px-6 py-3 rounded-full text-sm font-bold font-body hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <Home className="w-4 h-4" />
            Página inicial
          </Link>
          <Link
            href="/kits"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold font-body hover:bg-white/20 transition-all duration-300"
          >
            <Search className="w-4 h-4" />
            Ver os kits
          </Link>
        </div>

        <p className="mt-8 text-xs text-white/40 font-body">
          {siteConfig.name} — {siteConfig.tagline}
        </p>
      </div>
    </div>
  );
}
