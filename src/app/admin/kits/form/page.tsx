"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { KitForm } from "@/components/admin/kit-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { useCategories } from "@/hooks/api/use-categories";
import { useKitTypes } from "@/hooks/api/use-kit-types";
import { useKits } from "@/hooks/api/use-kits";

// Uma rota só para criar E editar kit (menos rotas = cabe no plano free da
// Vercel). Sem `?id` → novo kit; com `?id=xxx` → edição (mostra as fotos).

export default function KitFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#e8a0b4]" />
        </div>
      }
    >
      <KitFormInner />
    </Suspense>
  );
}

function KitFormInner() {
  const router = useRouter();
  const editId = useSearchParams().get("id");

  const { kits, isLoading: kitsLoading, reload } = useKits();
  const { categories, isLoading: catLoading, error: catError } = useCategories();
  const { kitTypes, isLoading: typesLoading, error: typesError } = useKitTypes();

  const isLoading = catLoading || typesLoading || (!!editId && kitsLoading);
  const loadError = catError ?? typesError;
  const kit = editId ? (kits.find((k) => k.id === editId) ?? null) : null;
  const missingDeps =
    !isLoading &&
    !editId &&
    (categories.length === 0 || kitTypes.length === 0);

  const backLink = (
    <Link
      href="/admin/kits"
      className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white font-body mb-4 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </Link>
  );

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        {backLink}
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#e8a0b4]" />
        </div>
      </div>
    );
  }

  // edição de um kit que não existe (ou foi removido)
  if (editId && !kit) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="font-heading text-xl font-bold text-white">
          Kit não encontrado
        </h1>
        <p className="text-sm text-white/55 mt-2 font-body">
          O kit pode ter sido removido.
        </p>
        <Link
          href="/admin/kits"
          className="inline-block mt-4 text-sm font-semibold text-[#e8a0b4] hover:text-white"
        >
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {backLink}

      <PageHeader
        title={kit ? "Editar kit" : "Novo kit"}
        description={
          kit
            ? kit.name
            : "Cadastre os dados do kit. As fotos são adicionadas depois de salvar."
        }
      />

      {loadError && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {loadError}
        </div>
      )}

      {missingDeps ? (
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
        <>
          <section className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
            {kit && (
              <>
                <h2 className="font-heading text-lg font-bold text-white mb-1">
                  Dados do kit
                </h2>
                <p className="text-sm text-white/55 font-body mb-6">
                  Nome, descrição, preço promocional, categoria e tipo.
                </p>
              </>
            )}
            <KitForm
              kit={kit}
              categories={categories}
              kitTypes={kitTypes}
              onCancel={() => router.push("/admin/kits")}
              onSuccess={(saved) => {
                if (kit) {
                  void reload();
                } else {
                  // recém-criado → vai pra edição pra adicionar fotos
                  router.push(`/admin/kits/form?id=${saved.id}`);
                }
              }}
            />
          </section>

          {/* Fotos só na edição (precisa do kit já criado) */}
          {kit && (
            <section className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-white mb-1">
                Fotos
              </h2>
              <p className="text-sm text-white/55 font-body mb-6">
                Envie quantas fotos quiser e marque uma como capa.
              </p>
              <ImageUpload
                key={kit.id}
                kitId={kit.id}
                initialImages={kit.images}
                onChanged={() => void reload()}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
