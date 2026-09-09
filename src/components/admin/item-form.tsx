"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { createItem, updateItem, type Item } from "@/hooks/api/use-items";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
});

type FormValues = z.infer<typeof schema>;

interface ItemFormProps {
  item?: Item | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ItemForm({ item, onSuccess, onCancel }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: item?.name ?? "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (item) {
        await updateItem(item.id, values);
        toast.success("Item atualizado.");
      } else {
        await createItem(values);
        toast.success("Item criado.");
      }
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao salvar item.";
      setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <label className="block">
        <span className="adm-label">
          Nome <span className="adm-label__req">*</span>
        </span>
        <input
          type="text"
          {...register("name")}
          className={inputClass}
          placeholder="Ex: Arco de balões"
          autoFocus
        />
        {errors.name && <span className="adm-error">{errors.name.message}</span>}
        <span className="adm-hint">
          Cadastre uma vez e use em quantos tipos de kit quiser.
        </span>
      </label>

      {errors.root?.message && (
        <div className="adm-alert">{errors.root.message}</div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="adm-btn adm-btn--ghost">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="adm-btn adm-btn--primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {item ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "adm-input";
