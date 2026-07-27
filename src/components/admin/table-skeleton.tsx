/**
 * Skeleton de tabela do admin — mesmo padrão visual do DataTable
 * (busca + card com header e linhas), no lugar do spinner central.
 */
export function TableSkeleton({
  rows = 5,
  columns = 3,
  withSearch = true,
}: {
  rows?: number;
  columns?: number;
  withSearch?: boolean;
}) {
  return (
    <div className="space-y-4 animate-pulse">
      {withSearch && (
        <div className="max-w-sm h-11 rounded-xl border border-border bg-card" />
      )}

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* header */}
        <div className="bg-muted border-b border-border px-5 py-3 flex gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-3 bg-white/10 rounded w-24" />
          ))}
        </div>
        {/* linhas */}
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="px-5 py-4 flex items-center gap-6 border-b border-border last:border-0"
          >
            {Array.from({ length: columns }).map((_, col) => (
              <div
                key={col}
                className="h-4 bg-white/5 rounded"
                style={{ width: `${col === 0 ? 160 : 90 + col * 20}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
