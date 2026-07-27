"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        data-theme="dark"
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-[#3d2832] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh] overflow-hidden",
          sizeClasses[size],
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a0b4]/40 to-transparent" />
        <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-white/55 mt-1 font-body">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
