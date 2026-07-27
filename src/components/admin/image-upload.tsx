"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import {
  deleteKitImage,
  reorderKitImages,
  uploadKitImage,
  type KitImage,
} from "@/hooks/api/use-kits";
import { ApiError } from "@/lib/api/client";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useConfirm } from "@/hooks/use-confirm";

interface ImageUploadProps {
  kitId: string;
  initialImages: KitImage[];
  onChanged?: () => void;
}

export function ImageUpload({
  kitId,
  initialImages,
  onChanged,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<KitImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  function commit(next: KitImage[]) {
    setImages(next);
    onChanged?.();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: KitImage[] = [];
      for (const file of Array.from(files)) {
        const { image } = await uploadKitImage(kitId, file);
        uploaded.push(image);
      }
      commit([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function persistOrder(next: KitImage[]) {
    const items = next.map((image, index) => ({
      id: image.id,
      order: index,
      isPrimary: image.isPrimary,
    }));
    const { images: updated } = await reorderKitImages(kitId, items);
    commit(updated);
  }

  async function handleSetPrimary(image: KitImage) {
    if (image.isPrimary) return;
    setBusyId(image.id);
    setError(null);
    try {
      const next = images.map((img) => ({
        ...img,
        isPrimary: img.id === image.id,
      }));
      await persistOrder(next);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao definir capa.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    setBusyId(images[index].id);
    setError(null);
    try {
      const next = [...images];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      await persistOrder(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao reordenar.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(image: KitImage) {
    const ok = await confirm({
      title: "Excluir foto?",
      description: "A imagem será removida do Cloudinary e do kit.",
      confirmLabel: "Excluir",
    });
    if (!ok) return;
    setBusyId(image.id);
    setError(null);
    try {
      await deleteKitImage(kitId, image.id);
      commit(images.filter((img) => img.id !== image.id));
      toast.success("Foto removida.");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Erro ao excluir foto.";
      setError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-10 px-6 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#e8a0b4]/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-[#e8a0b4] animate-spin" />
              <p className="text-sm text-white font-semibold font-body">
                Enviando...
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6 text-[#e8a0b4]" />
              <p className="text-sm text-white font-semibold font-body">
                Adicionar fotos
              </p>
              <p className="text-xs text-white/45 font-body">
                JPG, PNG, WebP ou AVIF — até 5MB cada
              </p>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-white/45 font-body py-4 text-center">
          Nenhuma foto enviada ainda.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const isBusy = busyId === image.id;
            return (
              <div
                key={image.id}
                className="group relative bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-white/[0.03]">
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#722e43] text-white text-xs font-bold font-body px-2 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 fill-white" />
                      Capa
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={isBusy || index === 0}
                      className="p-1.5 text-white/50 hover:text-[#e8a0b4] hover:bg-[#e8a0b4]/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={isBusy || index === images.length - 1}
                      className="p-1.5 text-white/50 hover:text-[#e8a0b4] hover:bg-[#e8a0b4]/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image)}
                      disabled={isBusy || image.isPrimary}
                      className="p-1.5 text-white/50 hover:text-[#e8a0b4] hover:bg-[#e8a0b4]/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Definir como capa"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(image)}
                      disabled={isBusy}
                      className="p-1.5 text-white/50 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                      aria-label="Excluir foto"
                    >
                      {isBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog {...confirmProps} />
    </div>
  );
}
