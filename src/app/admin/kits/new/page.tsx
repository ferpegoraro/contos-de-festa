"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { KitForm } from "@/components/admin/kit-form";
import { useCategories } from "@/hooks/api/use-categories";
import { useKitTypes } from "@/hooks/api/use-kit-types";

export default function NewKitPage() {
  const router = useRouter();
  const { categories, isLoading: catLoading, error: catError } = useCategories();
  const { kitTypes, isLoading: typesLoading, error: typesError } = useKitTypes();

  const isLoading = catLoading || typesLoading;
  const loadError = catError ?? typesError;
  const missingDeps =
    !isLoading && (categories.length === 0 || kitTypes.length === 0);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/kits"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white font-body mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <PageHeader
        title="Novo kit"
        description="Cadastre os dados do kit. As fotos serão adicionadas no próximo passo."
      />

      {loadError && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#e8a0b4]" />
        </div>
      ) : missingDeps ? (
        <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-3">
          <p className="text-sm text-white font-body">
            Pra criar um kit, você precisa ter ao menos uma categoria e um tipo
            de kit cadastrados.
          </p>
          <div className="flex gap-3">
            {categories.length === 0 && (
              <Link
                href="/admin/categories"
                className="text-sm font-semibold text-[#e8a0b4] hover:text-white"
              >
                Cadastrar categoria →
              </Link>
            )}
            {kitTypes.length === 0 && (
              <Link
                href="/admin/kit-types"
                className="text-sm font-semibold text-[#e8a0b4] hover:text-white"
              >
                Cadastrar tipo de kit →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8">
          <KitForm
            categories={categories}
            kitTypes={kitTypes}
            onCancel={() => router.push("/admin/kits")}
            onSuccess={(kit) => router.push(`/admin/kits/${kit.id}/edit`)}
          />
        </div>
      )}
    </div>
  );
}
