"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onCancel();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, submitting, onCancel]);

  if (!open) return null;

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8">
      <div
        onClick={() => !submitting && onCancel()}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        data-theme="dark"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md bg-[#3d2832] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a0b4]/40 to-transparent" />
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border",
              variant === "danger"
                ? "bg-red-500/15 text-red-300 border-red-400/30"
                : "bg-[#e8a0b4]/15 text-[#e8a0b4] border-[#e8a0b4]/30",
            )}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="font-heading text-lg font-bold text-white"
            >
              {title}
            </h2>
            {description && (
              <div className="mt-2 text-sm text-white/55 font-body">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 rounded-full text-sm font-semibold font-body text-white/60 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold font-body text-white transition-colors flex items-center gap-2 disabled:opacity-60",
              variant === "danger"
                ? "bg-red-500/90 hover:bg-red-500 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.5)]"
                : "bg-[#722e43] hover:bg-[#9b3a5a] shadow-[0_8px_24px_-8px_rgba(232,160,180,0.4)]",
            )}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
