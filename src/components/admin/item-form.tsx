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
        <span className="block text-xs font-bold text-white/65 mb-2 font-body uppercase tracking-[0.12em]">
          Nome <span className="text-[#e8a0b4]">*</span>
        </span>
        <input
          type="text"
          {...register("name")}
          className={inputClass}
          placeholder="Ex: Arco de balões"
          autoFocus
        />
        {errors.name && (
          <span className="block text-xs text-red-300 mt-1 font-body">
            {errors.name.message}
          </span>
        )}
        <span className="block text-xs text-white/40 mt-1 font-body">
          Cadastre uma vez e use em quantos tipos de kit quiser.
        </span>
      </label>

      {errors.root?.message && (
        <div className="text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {errors.root.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full text-sm font-semibold font-body text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-bold font-body bg-[#722e43] text-white hover:bg-[#9b3a5a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-[0_8px_24px_-8px_rgba(232,160,180,0.4)]"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {item ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/25 font-body focus:outline-none focus:ring-2 focus:ring-[#e8a0b4]/40 focus:border-[#e8a0b4]/40 hover:bg-white/[0.06] transition";
