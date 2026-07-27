export function CategorySkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 animate-pulse">
      <div className="h-6 bg-white/5 rounded-lg w-2/3" />
      <div className="mt-4 h-4 bg-white/5 rounded-lg w-24" />
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}
