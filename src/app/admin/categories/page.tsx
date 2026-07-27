"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { Modal } from "@/components/admin/modal";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import {
  deleteCategory,
  useCategories,
  type Category,
} from "@/hooks/api/use-categories";
import { ApiError } from "@/lib/api/client";

export default function CategoriesAdminPage() {
  const { categories, isLoading, error, reload } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
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

  async function handleDelete(category: Category) {
    const ok = await confirm({
      title: `Excluir "${category.name}"?`,
      description: "Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir",
    });
    if (!ok) return;
    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      await reload();
      toast.success("Categoria excluída.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Erro ao excluir categoria.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
      ),
    },
    {
      key: "icon",
      header: "Ícone",
      render: (row) =>
        row.icon ? (
          <span className="font-mono text-xs text-muted-foreground">{row.icon}</span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize os kits por categoria (aniversário, casamento, ...)."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-body px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            Nova categoria
          </button>
        }
      />

      {error && (
        <div className="mb-4 text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <DataTable
          data={categories}
          columns={columns}
          rowKey={(row) => row.id}
          searchKeys={["name", "slug"]}
          searchPlaceholder="Buscar por nome ou slug"
          emptyMessage="Nenhuma categoria cadastrada ainda."
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
        title={editing ? "Editar categoria" : "Nova categoria"}
      >
        <CategoryForm
          category={editing}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog {...confirmProps} />
    </>
  );
}
