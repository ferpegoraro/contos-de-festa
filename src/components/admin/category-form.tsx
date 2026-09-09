"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import {
  createCategory,
  updateCategory,
  type Category,
} from "@/hooks/api/use-categories";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      slug: values.slug?.trim() || undefined,
      description: values.description?.trim() || null,
      icon: values.icon?.trim() || null,
    };
    try {
      if (category) {
        await updateCategory(category.id, payload);
        toast.success("Categoria atualizada.");
      } else {
        await createCategory(payload);
        toast.success("Categoria criada.");
      }
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao salvar categoria.";
      setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Nome" required error={errors.name?.message}>
        <input
          type="text"
          {...register("name")}
          className={inputClass}
          placeholder="Ex: Aniversário"
        />
      </Field>

      <Field
        label="Slug"
        hint="Opcional. Gerado a partir do nome se vazio."
        error={errors.slug?.message}
      >
        <input
          type="text"
          {...register("slug")}
          className={inputClass}
          placeholder="aniversario"
        />
      </Field>

      <Field
        label="Ícone"
        hint="Nome de um ícone Lucide (opcional)."
        error={errors.icon?.message}
      >
        <input
          type="text"
          {...register("icon")}
          className={inputClass}
          placeholder="party-popper"
        />
      </Field>

      <Field label="Descrição" hint="Opcional." error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Descrição curta"
        />
      </Field>

      {errors.root?.message && (
        <div className="adm-alert">{errors.root.message}</div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="adm-btn adm-btn--ghost">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="adm-btn adm-btn--primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {category ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "adm-input";

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="adm-label">
        {label}
        {required && <span className="adm-label__req"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="adm-error">{error}</span>
      ) : hint ? (
        <span className="adm-hint">{hint}</span>
      ) : null}
    </label>
  );
}
