"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { useQuote } from "@/contexts/quote-context";
import { useIsAdminRoute } from "@/hooks/use-is-admin-route";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";

export function QuoteCart() {
  const [open, setOpen] = useState(false);
  const { items, totalItems, removeItem, clearItems, generateWhatsAppUrl } =
    useQuote();
  const isAdmin = useIsAdminRoute();

  if (isAdmin || totalItems === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.kit.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-[#722e43] hover:bg-[#9b3a5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#e8a0b4] text-[#2d1a22] text-xs font-bold font-body flex items-center justify-center">
          {totalItems}
        </span>
      </motion.button>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-full max-w-md bg-[#2d1a22] border-r border-white/10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#e8a0b4]" />
                  <h2 className="font-heading text-lg font-bold text-white">
                    Meu Orçamento
                  </h2>
                  <span className="text-sm text-white/40 font-body">
                    ({totalItems} {totalItems === 1 ? "item" : "itens"})
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.kit.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-white truncate">
                          {item.kit.name}
                        </h3>
                        <p className="text-xs text-white/40 font-body mt-0.5">
                          {item.kit.category.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-heading font-bold text-[#fce8ef]">
                            R${" "}
                            {(item.kit.price * item.quantity)
                              .toFixed(2)
                              .replace(".", ",")}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-white/30 font-body">
                              {item.quantity}x R${" "}
                              {item.kit.price.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.kit.id)}
                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-body">
                    Total estimado
                  </span>
                  <span className="text-xl font-heading font-bold text-[#fce8ef]">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3.5 rounded-full font-bold font-body hover:bg-[#20bd5a] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Enviar Orçamento via WhatsApp
                </a>

                {/* Clear */}
                <button
                  onClick={clearItems}
                  className="w-full text-center text-sm text-white/30 font-body hover:text-white/50 transition-colors"
                >
                  Limpar orçamento
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
