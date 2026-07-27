"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body ${column.className ?? ""}`}
                  >
                    {column.header}
                  </th>
                ))}
                {actions && (
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body text-right">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-5 py-10 text-center text-sm text-muted-foreground font-body"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-3.5 text-sm text-foreground font-body ${column.className ?? ""}`}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
