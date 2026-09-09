"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
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
        className="inline-flex items-center gap-1.5 text-sm text-[#8f7681] hover:text-[#f2e8ec] font-body mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <PageHeader
        title="Novo kit"
        description="Preencha os dados e escolha as fotos — tudo salva de uma vez."
      />

      {loadError && <div className="adm-alert mb-4">{loadError}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#e8a0b4]" />
        </div>
      ) : missingDeps ? (
        <div className="adm-panel p-6 space-y-3">
          <p className="text-sm text-[#f2e8ec] font-body">
            Pra criar um kit, você precisa ter ao menos uma categoria e um tipo
            de kit cadastrados.
          </p>
          <div className="flex gap-3">
            {categories.length === 0 && (
              <Link href="/admin/categories" className="text-sm adm-link">
                Cadastrar categoria →
              </Link>
            )}
            {kitTypes.length === 0 && (
              <Link href="/admin/kit-types" className="text-sm adm-link">
                Cadastrar tipo de kit →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="adm-panel p-6 sm:p-8">
          <KitForm
            categories={categories}
            kitTypes={kitTypes}
            onCancel={() => router.push("/admin/kits")}
            onSuccess={(kit) => {
              toast.success(`Kit "${kit.name}" criado com as fotos.`);
              router.push("/admin/kits");
            }}
          />
        </div>
      )}
    </div>
  );
}
