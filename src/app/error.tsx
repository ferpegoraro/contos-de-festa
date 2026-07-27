"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#5a2435] to-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-rosa" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Algo deu errado
        </h1>
        <p className="mt-3 text-white/70 font-body">
          Tivemos um problema ao carregar essa página. Tente novamente ou volte
          para o início.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold font-body hover:scale-105 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar de novo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold font-body hover:bg-white/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
