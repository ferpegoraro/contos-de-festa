"use client";

import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import {
  createKit,
  updateKit,
  uploadKitImage,
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
  // Fotos escolhidas na hora de criar (sobem junto no "Criar kit").
  const [staged, setStaged] = useState<{ file: File; url: string }[]>([]);
  const [phase, setPhase] = useState<"" | "saving" | "uploading">("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedType = kitTypes.find((type) => type.id === kitTypeId) ?? null;

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next = Array.from(list).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setStaged((prev) => [...prev, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeStaged(index: number) {
    setStaged((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

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
      if (kit) {
        const result = await updateKit(kit.id, payload);
        onSuccess(result.kit);
        return;
      }

      // Criar: primeiro o kit, depois sobe as fotos escolhidas.
      setPhase("saving");
      const result = await createKit(payload);
      if (staged.length > 0) {
        setPhase("uploading");
        for (const { file } of staged) {
          await uploadKitImage(result.kit.id, file);
        }
      }
      staged.forEach((s) => URL.revokeObjectURL(s.url));
      onSuccess(result.kit);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar kit.");
    } finally {
      setSubmitting(false);
      setPhase("");
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
      <div className="adm-panel-2 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="adm-label !mb-1">Preço</p>
          {selectedType ? (
            <p className="font-heading text-2xl text-[#e8a0b4] mt-1 leading-none adm-num">
              R$ {formatPrice(selectedType.price)}
              <span className="font-body text-xs text-[#8f7681] ml-2 align-middle">
                herdado do tipo {selectedType.name}
              </span>
            </p>
          ) : (
            <p className="text-sm text-[#8f7681] font-body mt-1">
              Selecione um tipo de kit — o preço vem dele.
            </p>
          )}
        </div>

        <label className="block sm:w-56 shrink-0">
          <span className="adm-label">Preço promocional (R$)</span>
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
          <span className="adm-hint">Opcional — vazio usa o preço do tipo.</span>
        </label>
      </div>

      {/* Destaque — controla quem aparece primeiro */}
      <label className="adm-panel-2 flex items-start gap-3 p-4 cursor-pointer hover:border-[#e8a0b4]/35 transition-colors">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#e8a0b4] cursor-pointer"
        />
        <span>
          <span className="block text-sm font-semibold text-[#f2e8ec] font-body">
            ⭐ Kit em destaque
          </span>
          <span className="block text-xs text-[#8f7681] font-body mt-0.5">
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
        <div className="adm-panel-2 px-4 py-3">
          <p className="adm-label !mb-2">
            Itens inclusos (do tipo {selectedType.name})
          </p>
          <ul className="text-sm text-[#bda3ac] font-body space-y-1">
            {selectedType.items.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                • {item.name}
                {item.quantity != null && (
                  <span className="text-[#8f7681]"> ×{item.quantity}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="adm-hint">Para editar os itens, vá em Tipos de Kit.</p>
        </div>
      )}

      {/* Fotos — escolhidas agora, sobem junto ao criar o kit */}
      {!kit && (
        <div>
          <span className="adm-label">Fotos</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {staged.map((s, i) => (
              <div
                key={s.url}
                className="group relative aspect-square rounded-lg overflow-hidden"
                style={{ border: "1px solid var(--line-2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeStaged(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 adm-tag adm-tag--rosa !py-0 !text-[10px]">
                    Capa
                  </span>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-[#4a3540] bg-[#22141b] hover:border-[#e8a0b4]/45 hover:text-[#e8a0b4] text-[#8f7681] flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-[11px] font-body">Adicionar</span>
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="adm-hint">
            A primeira foto vira a capa. Elas sobem quando você clicar em “Criar
            kit”. (Dá pra reordenar depois, na edição.)
          </span>
        </div>
      )}

      {error && <div className="adm-alert">{error}</div>}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="adm-btn adm-btn--ghost">
          Cancelar
        </button>
        <button type="submit" disabled={submitting} className="adm-btn adm-btn--primary">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {kit
            ? "Salvar alterações"
            : phase === "uploading"
              ? "Enviando fotos..."
              : phase === "saving"
                ? "Criando kit..."
                : "Criar kit"}
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
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="adm-label">
        {label}
        {required && <span className="adm-label__req"> *</span>}
      </span>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}
