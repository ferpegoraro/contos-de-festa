"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Search } from "lucide-react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const bodyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } },
};

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum registro encontrado.",
  rowKey,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim() || !searchKeys?.length) return data;
    const term = search.trim().toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        return typeof value === "string"
          ? value.toLowerCase().includes(term)
          : false;
      }),
    );
  }, [data, search, searchKeys]);

  return (
    <div className="space-y-4">
      {searchKeys && searchKeys.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f7681] pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="adm-input !pl-10"
          />
        </div>
      )}

      <motion.div
        className="adm-panel overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={column.className ?? ""}>
                    {column.header}
                  </th>
                ))}
                {actions && <th className="text-right">Ações</th>}
              </tr>
            </thead>
            {filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="!py-10 text-center !text-[#8f7681]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              </tbody>
            ) : (
              <motion.tbody
                variants={bodyVariants}
                initial="hidden"
                animate="show"
              >
                {filtered.map((row) => (
                  <motion.tr
                    key={rowKey(row)}
                    variants={rowVariants}
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty(
                        "--mx",
                        `${e.clientX - r.left}px`,
                      );
                      e.currentTarget.style.setProperty(
                        "--my",
                        `${e.clientY - r.top}px`,
                      );
                      e.currentTarget.style.setProperty("--glow", "1");
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty("--glow", "0");
                    }}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={column.className ?? ""}>
                        {column.render(row)}
                      </td>
                    ))}
                    {actions && (
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </motion.tbody>
            )}
          </table>
        </div>
      </motion.div>
    </div>
  );
}
