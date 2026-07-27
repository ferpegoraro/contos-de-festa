"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Kit } from "@/types/kit";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface QuoteItem {
  kit: Kit;
  quantity: number;
}

interface QuoteContextType {
  items: QuoteItem[];
  totalItems: number;
  addItem: (kit: Kit) => void;
  removeItem: (kitId: string) => void;
  clearItems: () => void;
  isInQuote: (kitId: string) => boolean;
  generateWhatsAppUrl: () => string;
}

const QuoteContext = createContext<QuoteContextType | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback((kit: Kit) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.kit.id === kit.id);
      if (existing) {
        return prev.map((item) =>
          item.kit.id === kit.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { kit, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((kitId: string) => {
    setItems((prev) => prev.filter((item) => item.kit.id !== kitId));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const isInQuote = useCallback(
    (kitId: string) => items.some((item) => item.kit.id === kitId),
    [items],
  );

  const generateWhatsAppUrl = useCallback(() => {
    if (items.length === 0) {
      return buildWhatsAppUrl();
    }

    const kitsList = items
      .map(
        (item) =>
          `• ${item.kit.name} (${item.quantity}x) — R$ ${(item.kit.price * item.quantity).toFixed(2).replace(".", ",")}`,
      )
      .join("\n");

    const total = items.reduce(
      (sum, item) => sum + item.kit.price * item.quantity,
      0,
    );

    const message = `Olá! Vim pelo site e gostaria de solicitar um orçamento:\n\n${kitsList}\n\nTotal estimado: R$ ${total.toFixed(2).replace(".", ",")}\n\nAguardo retorno!`;

    return buildWhatsAppUrl(message);
  }, [items]);

  return (
    <QuoteContext.Provider
      value={{
        items,
        totalItems,
        addItem,
        removeItem,
        clearItems,
        isInQuote,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
