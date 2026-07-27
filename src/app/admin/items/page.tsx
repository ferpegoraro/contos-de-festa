"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { Modal } from "@/components/admin/modal";
import { ItemForm } from "@/components/admin/item-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteItem, useItems, type Item } from "@/hooks/api/use-items";
import { ApiError } from "@/lib/api/client";

export default function ItemsAdminPage() {
  const { items, isLoading, error } = useItems();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleDelete(item: Item) {
    const ok = await confirm({
      title: `Excluir "${item.name}"?`,
      description:
        "Só é possível excluir itens que não estão em uso por nenhum tipo de kit.",
      confirmLabel: "Excluir",
    });
    if (!ok) return;
    setDeletingId(item.id);
    try {
      await deleteItem(item.id);
      toast.success("Item excluído.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao excluir item.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const columns: Column<Item>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Itens"
        description="O catálogo de peças (arco, pano, painel...). Cadastre aqui e selecione nos Tipos de Kit com a quantidade."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            Novo item
          </button>
        }
      />

      {error && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columns={1} />
      ) : (
        <DataTable
          data={items}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["name"]}
          searchPlaceholder="Buscar por nome"
          emptyMessage="Nenhum item cadastrado ainda. Crie o primeiro!"
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
        title={editing ? "Editar item" : "Novo item"}
        size="sm"
      >
        <ItemForm item={editing} onSuccess={closeModal} onCancel={closeModal} />
      </Modal>

      <ConfirmDialog {...confirmProps} />
    </>
  );
}
