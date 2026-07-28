"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { KitForm } from "@/components/admin/kit-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { useCategories } from "@/hooks/api/use-categories";
import { useKitTypes } from "@/hooks/api/use-kit-types";
import { useKits } from "@/hooks/api/use-kits";

export default function EditKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { kits, isLoading: kitsLoading, reload } = useKits();
  const { categories, isLoading: catLoading } = useCategories();
  const { kitTypes, isLoading: typesLoading } = useKitTypes();

  const isLoading = kitsLoading || catLoading || typesLoading;
  const kit = kits.find((k) => k.id === id) ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#e8a0b4]" />
      </div>
    );
  }

  if (!kit) {
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
      <Link
        href="/admin/kits"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white font-body mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <PageHeader title="Editar kit" description={kit.name} />

      <section className="bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
        <h2 className="font-heading text-lg font-bold text-white mb-1">
          Dados do kit
        </h2>
        <p className="text-sm text-white/55 font-body mb-6">
          Nome, descrição, preço, categoria e itens inclusos.
        </p>
        <KitForm
          kit={kit}
          categories={categories}
          kitTypes={kitTypes}
          onCancel={() => router.push("/admin/kits")}
          onSuccess={() => {
            void reload();
          }}
        />
      </section>

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
    </div>
  );
}
