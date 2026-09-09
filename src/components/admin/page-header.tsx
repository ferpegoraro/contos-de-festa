"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <motion.header
      className="mb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#f2e8ec] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-[#bda3ac] mt-2 font-body max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <motion.div
            className="flex items-center gap-2 shrink-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT }}
          >
            {actions}
          </motion.div>
        )}
      </div>
      <motion.div
        className="mt-5 origin-left"
        style={{ borderBottom: "1px solid var(--line)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
      />
    </motion.header>
  );
}
