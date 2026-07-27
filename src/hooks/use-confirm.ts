"use client";

import { useCallback, useState, type ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...options, resolve });
      }),
    [],
  );

  const handleConfirm = useCallback(() => {
    pending?.resolve(true);
    setPending(null);
  }, [pending]);

  const handleCancel = useCallback(() => {
    pending?.resolve(false);
    setPending(null);
  }, [pending]);

  return {
    confirm,
    confirmProps: pending
      ? {
          open: true,
          title: pending.title,
          description: pending.description,
          confirmLabel: pending.confirmLabel,
          cancelLabel: pending.cancelLabel,
          variant: pending.variant,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        }
      : {
          open: false,
          title: "",
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        },
  };
}
