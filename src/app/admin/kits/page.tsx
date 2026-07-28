"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import {
  deleteKit,
  useKits,
  type Kit,
} from "@/hooks/api/use-kits";
import { ApiError } from "@/lib/api/client";

export default function KitsAdminPage() {
  const { kits, isLoading, error, reload } = useKits({ pageSize: 100 });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  async function handleDelete(kit: Kit) {
    const ok = await confirm({
      title: `Excluir "${kit.name}"?`,
      description: "As fotos também serão removidas. Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir",
    });
    if (!ok) return;
    setDeletingId(kit.id);
    try {
      await deleteKit(kit.id);
      await reload();
      toast.success("Kit excluído.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao excluir kit.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const columns: Column<Kit>[] = [
    {
      key: "image",
      header: "Foto",
      render: (row) => {
        const cover = row.images.find((img) => img.isPrimary) ?? row.images[0];
        return (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
            {cover ? (
              <Image
                src={cover.url}
                alt={cover.alt ?? row.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs font-body">
                —
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (row) => (
        <span className="text-foreground">{row.category?.name ?? "—"}</span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) => (
        <span className="text-foreground">{row.kitType?.name ?? "—"}</span>
      ),
    },
    {
      key: "price",
      header: "Preço",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span className="font-semibold text-primary">
            R$ {row.price.toFixed(2).replace(".", ",")}
          </span>
          {row.priceOverride != null && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e8a0b4]/15 text-[#e8a0b4] text-[10px] font-bold font-body uppercase tracking-wide"
              title={`Promocional — o tipo custa R$ ${row.kitType.price.toFixed(2).replace(".", ",")}`}
            >
              Promo
            </span>
          )}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Destaque",
      render: (row) =>
        row.featured ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-primary text-xs font-semibold font-body">
            Sim
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Kits"
        description="Cadastre, edite ou remova kits e suas fotos."
        actions={
          <Link
            href="/admin/kits/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            Novo kit
          </Link>
        }
      />

      {error && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columns={6} />
      ) : (
        <DataTable
          data={kits}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["name", "slug"]}
          searchPlaceholder="Buscar por nome ou slug"
          emptyMessage="Nenhum kit cadastrado ainda."
          actions={(row) => (
            <>
              <Link
                href={`/admin/kits/${row.id}/edit`}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                aria-label={`Editar ${row.name}`}
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(row)}
                disabled={deletingId === row.id}
                className="p-2 text-muted-foreground hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                aria-label={`Excluir ${row.name}`}
              >
                {deletingId === row.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        />
      )}

      <ConfirmDialog {...confirmProps} />
    </>
  );
}
