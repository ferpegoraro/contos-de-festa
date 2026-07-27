"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function AdminError({
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
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-500/15 border border-red-400/30 text-red-300 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="font-heading text-xl font-bold text-white">
        Algo deu errado neste painel
      </h2>
      <p className="mt-2 text-sm text-white/55 font-body">
        Recarregue a tela. Se persistir, faça login de novo.
      </p>
      <button
        onClick={() => reset()}
        className="mt-5 inline-flex items-center gap-2 bg-[#722e43] hover:bg-[#9b3a5a] text-white px-4 py-2 rounded-full text-sm font-bold font-body transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Tentar de novo
      </button>
    </div>
  );
}
