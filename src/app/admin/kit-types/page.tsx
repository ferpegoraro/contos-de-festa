"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { Modal } from "@/components/admin/modal";
import { KitTypeForm } from "@/components/admin/kit-type-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import {
  deleteKitType,
  useKitTypes,
  type KitType,
} from "@/hooks/api/use-kit-types";
import { ApiError } from "@/lib/api/client";

export default function KitTypesAdminPage() {
  const { kitTypes, isLoading, error, reload } = useKitTypes();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KitType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(kitType: KitType) {
    setEditing(kitType);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSuccess() {
    closeModal();
    await reload();
  }

  async function handleDelete(kitType: KitType) {
    const ok = await confirm({
      title: `Excluir "${kitType.name}"?`,
      description: "Os kits dele precisarão ser realocados.",
      confirmLabel: "Excluir",
    });
    if (!ok) return;
    setDeletingId(kitType.id);
    try {
      await deleteKitType(kitType.id);
      await reload();
      toast.success("Tipo de kit excluído.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao excluir tipo de kit.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const columns: Column<KitType>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name}</span>
      ),
    },
    {
      key: "price",
      header: "Preço",
      render: (row) => (
        <span className="font-semibold text-primary">
          R$ {row.price.toFixed(2).replace(".", ",")}
        </span>
      ),
    },
    {
      key: "items",
      header: "Itens inclusos",
      render: (row) =>
        row.items.length > 0 ? (
          <span className="text-sm text-foreground">
            {row.items.length}{" "}
            <span className="text-muted-foreground">
              ({row.items
                .slice(0, 3)
                .map((item) => item.name)
                .join(", ")}
              {row.items.length > 3 ? "..." : ""})
            </span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Tipos de Kit"
        description="Defina os formatos disponíveis (Kit de Mesa, Kit 1, Kit 2, ...)."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            Novo tipo
          </button>
        }
      />

      {error && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columns={2} />
      ) : (
        <DataTable
          data={kitTypes}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["name", "slug"]}
          searchPlaceholder="Buscar por nome ou slug"
          emptyMessage="Nenhum tipo de kit cadastrado ainda."
          actions={(row) => (
            <>
              <button
                onClick={() => openEdit(row)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                aria-label={`Editar ${row.name}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
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

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Editar tipo de kit" : "Novo tipo de kit"}
        size="sm"
      >
        <KitTypeForm
          kitType={editing}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog {...confirmProps} />
    </>
  );
}
