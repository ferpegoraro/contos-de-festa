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
        className="adm relative w-full max-w-md rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-6 overflow-hidden"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border",
              variant === "danger"
                ? "bg-[#e26b7d]/15 text-[#e26b7d] border-[#e26b7d]/30"
                : "bg-[#e8a0b4]/15 text-[#e8a0b4] border-[#e8a0b4]/30",
            )}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="font-heading text-lg font-bold text-[#f2e8ec]"
            >
              {title}
            </h2>
            {description && (
              <div className="mt-2 text-sm text-[#bda3ac] font-body">
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
            className="adm-btn adm-btn--ghost"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={cn(
              "adm-btn",
              variant === "danger" ? "adm-btn--danger" : "adm-btn--primary",
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
