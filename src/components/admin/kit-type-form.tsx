"use client";

import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { useItems } from "@/hooks/api/use-items";
import {
  createKitType,
  updateKitType,
  type KitType,
} from "@/hooks/api/use-kit-types";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
  slug: z.string().optional(),
  price: z
    .string()
    .min(1, "Informe o preço do tipo.")
    .refine((value) => {
      const parsed = Number.parseFloat(value.replace(",", "."));
      return !Number.isNaN(parsed) && parsed >= 0;
    }, "Preço inválido."),
  items: z.array(
    z.object({
      itemId: z.string().min(1, "Selecione um item."),
      quantity: z.string().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

interface KitTypeFormProps {
  kitType?: KitType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function KitTypeForm({
  kitType,
  onSuccess,
  onCancel,
}: KitTypeFormProps) {
  const { items: catalog, isLoading: catalogLoading } = useItems();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: kitType?.name ?? "",
      slug: kitType?.slug ?? "",
      price: kitType ? String(kitType.price) : "",
      items:
        kitType?.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity == null ? "" : String(item.quantity),
        })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  async function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      slug: values.slug?.trim() || undefined,
      price: Number.parseFloat(values.price.replace(",", ".")),
      items: values.items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity?.trim()
          ? Number.parseInt(item.quantity, 10)
          : null,
      })),
    };
    try {
      if (kitType) {
        await updateKitType(kitType.id, payload);
        toast.success("Tipo de kit atualizado.");
      } else {
        await createKitType(payload);
        toast.success("Tipo de kit criado.");
      }
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao salvar tipo de kit.";
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
          placeholder="Ex: Kit Básico"
        />
        {errors.name && (
          <span className="block text-xs text-red-300 mt-1 font-body">
            {errors.name.message}
          </span>
        )}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-bold text-white/65 mb-2 font-body uppercase tracking-[0.12em]">
            Preço (R$) <span className="text-[#e8a0b4]">*</span>
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("price")}
            className={inputClass}
            placeholder="150.00"
          />
          {errors.price && (
            <span className="block text-xs text-red-300 mt-1 font-body">
              {errors.price.message}
            </span>
          )}
          <span className="block text-xs text-white/40 mt-1 font-body">
            Todos os kits deste tipo herdam esse preço.
          </span>
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-white/65 mb-2 font-body uppercase tracking-[0.12em]">
            Slug
          </span>
          <input
            type="text"
            {...register("slug")}
            className={inputClass}
            placeholder="kit-basico (opcional)"
          />
          <span className="block text-xs text-white/40 mt-1 font-body">
            Gerado a partir do nome se vazio.
          </span>
        </label>
      </div>

      {/* Itens inclusos no tipo — selecionados do catálogo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="block text-xs font-bold text-white/65 font-body uppercase tracking-[0.12em]">
            Itens inclusos
          </span>
          <button
            type="button"
            onClick={() => append({ itemId: "", quantity: "" })}
            disabled={catalog.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold font-body text-[#e8a0b4] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar item
          </button>
        </div>

        {catalog.length === 0 && !catalogLoading ? (
          <p className="text-xs text-white/40 font-body border border-dashed border-white/10 rounded-xl px-4 py-3">
            Nenhum item no catálogo ainda. Cadastre primeiro em{" "}
            <Link
              href="/admin/items"
              className="text-[#e8a0b4] hover:underline"
            >
              Itens
            </Link>{" "}
            (ex.: Arco de balões, Pano de mesa).
          </p>
        ) : fields.length === 0 ? (
          <p className="text-xs text-white/40 font-body border border-dashed border-white/10 rounded-xl px-4 py-3">
            Selecione os itens do catálogo que vêm em todos os kits deste tipo
            (ex.: Arco de balões ×1, Pano de mesa ×2).
          </p>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <select
                    {...register(`items.${index}.itemId`)}
                    className={`${inputClass} h-11`}
                  >
                    <option value="">Selecione um item...</option>
                    {catalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.itemId && (
                    <span className="block text-xs text-red-300 mt-1 font-body">
                      {errors.items[index]?.itemId?.message}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`)}
                  className={`${quantityClass} h-11 shrink-0`}
                  placeholder="Qtd."
                  title="Quantidade (opcional)"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2.5 shrink-0 text-white/40 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
          {kitType ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/25 font-body focus:outline-none focus:ring-2 focus:ring-[#e8a0b4]/40 focus:border-[#e8a0b4]/40 hover:bg-white/[0.06] transition";

/* Mesma aparência, mas largura fixa (sem w-full) pro campo de quantidade. */
const quantityClass =
  "w-20 px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/25 font-body focus:outline-none focus:ring-2 focus:ring-[#e8a0b4]/40 focus:border-[#e8a0b4]/40 hover:bg-white/[0.06] transition";
