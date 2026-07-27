"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import {
  createKit,
  updateKit,
  type Kit,
  type KitInput,
} from "@/hooks/api/use-kits";
import type { Category } from "@/hooks/api/use-categories";
import type { KitType } from "@/hooks/api/use-kit-types";

interface KitFormProps {
  kit?: Kit | null;
  categories: Category[];
  kitTypes: KitType[];
  onSuccess: (kit: Kit) => void;
  onCancel: () => void;
}

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function KitForm({
  kit,
  categories,
  kitTypes,
  onSuccess,
  onCancel,
}: KitFormProps) {
  const [name, setName] = useState(kit?.name ?? "");
  const [slug, setSlug] = useState(kit?.slug ?? "");
  const [description, setDescription] = useState(kit?.description ?? "");
  const [shortDescription, setShortDescription] = useState(
    kit?.shortDescription ?? "",
  );
  const [priceOverride, setPriceOverride] = useState(
    kit?.priceOverride == null ? "" : String(kit.priceOverride),
  );
  const [kitTypeId, setKitTypeId] = useState(kit?.kitTypeId ?? "");
  const [categoryId, setCategoryId] = useState(kit?.categoryId ?? "");
  const [featured, setFeatured] = useState(kit?.featured ?? false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedType = kitTypes.find((type) => type.id === kitTypeId) ?? null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    let parsedOverride: number | null = null;
    if (priceOverride.trim() !== "") {
      parsedOverride = Number.parseFloat(priceOverride.replace(",", "."));
      if (Number.isNaN(parsedOverride) || parsedOverride < 0) {
        setError("Preço promocional inválido.");
        return;
      }
    }

    const payload: KitInput = {
      name,
      slug: slug.trim() || undefined,
      description,
      shortDescription: shortDescription.trim() || null,
      priceOverride: parsedOverride,
      kitTypeId,
      categoryId,
      featured,
    };

    setSubmitting(true);
    try {
      const result = kit
        ? await updateKit(kit.id, payload)
        : await createKit(payload);
      onSuccess(result.kit);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar kit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nome" required>
          <input
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Ex: Kit Princesa"
          />
        </Field>

        <Field label="Slug" hint="Opcional. Gerado a partir do nome se vazio.">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="kit-princesa"
          />
        </Field>

        <Field label="Tipo de Kit" required>
          <select
            required
            value={kitTypeId}
            onChange={(e) => setKitTypeId(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione...</option>
            {kitTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} — R$ {formatPrice(type.price)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Categoria" required>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

      </div>

      {/* Painel de preço — herdado do tipo + promoção opcional */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold text-white/65 font-body uppercase tracking-[0.12em]">
            Preço
          </p>
          {selectedType ? (
            <p className="font-heading text-2xl text-[#e8a0b4] mt-1 leading-none">
              R$ {formatPrice(selectedType.price)}
              <span className="font-body text-xs text-white/40 ml-2 align-middle">
                herdado do tipo {selectedType.name}
              </span>
            </p>
          ) : (
            <p className="text-sm text-white/40 font-body mt-1">
              Selecione um tipo de kit — o preço vem dele.
            </p>
          )}
        </div>

        <label className="block sm:w-56 shrink-0">
          <span className="block text-xs font-bold text-white/65 mb-2 font-body uppercase tracking-[0.12em]">
            Preço promocional (R$)
          </span>
          <input
            type="number"
            step="0.01"
            min={0}
            value={priceOverride}
            onChange={(e) => setPriceOverride(e.target.value)}
            className={inputClass}
            placeholder={
              selectedType ? formatPrice(selectedType.price) : "0,00"
            }
          />
          <span className="block text-xs text-white/40 mt-1 font-body">
            Opcional — vazio usa o preço do tipo.
          </span>
        </label>
      </div>

      {/* Destaque — controla quem aparece primeiro */}
      <label className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/[0.05] transition-colors">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#e8a0b4] cursor-pointer"
        />
        <span>
          <span className="block text-sm font-semibold text-white font-body">
            ⭐ Kit em destaque
          </span>
          <span className="block text-xs text-white/45 font-body mt-0.5">
            Aparece primeiro no catálogo (dentro do tipo dele) e na seção de
            destaques da home.
          </span>
        </span>
      </label>

      <Field label="Descrição curta" hint="Aparece nos cards. Opcional.">
        <input
          type="text"
          maxLength={140}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className={inputClass}
          placeholder="Resumo de uma linha"
        />
      </Field>

      <Field
        label="Descrição completa"
        hint="Opcional. Aparece na página do kit."
      >
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Conte o tema, a vibe, os detalhes da decoração..."
        />
      </Field>

      {/* Itens inclusos agora pertencem ao Tipo de Kit */}
      {selectedType && selectedType.items.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-white/65 font-body uppercase tracking-[0.12em] mb-2">
            Itens inclusos (do tipo {selectedType.name})
          </p>
          <ul className="text-sm text-white/60 font-body space-y-1">
            {selectedType.items.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                • {item.name}
                {item.quantity != null && (
                  <span className="text-white/35"> ×{item.quantity}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/40 font-body mt-2">
            Para editar os itens, vá em Tipos de Kit.
          </p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
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
          disabled={submitting}
          className="px-5 py-2.5 rounded-full text-sm font-bold font-body bg-[#722e43] text-white hover:bg-[#9b3a5a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-[0_8px_24px_-8px_rgba(232,160,180,0.4)]"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {kit ? "Salvar alterações" : "Criar kit"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-white/25 font-body focus:outline-none focus:ring-2 focus:ring-[#e8a0b4]/40 focus:border-[#e8a0b4]/40 hover:bg-white/[0.06] transition";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-white/65 mb-2 font-body uppercase tracking-[0.12em]">
        {label}
        {required && <span className="text-[#e8a0b4]"> *</span>}
      </span>
      {children}
      {hint && (
        <span className="block text-xs text-white/40 mt-1 font-body">
          {hint}
        </span>
      )}
    </label>
  );
}
