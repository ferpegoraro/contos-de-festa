export function KitSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-white/5" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/5 rounded-lg w-3/4" />
        <div className="h-4 bg-white/5 rounded-lg w-full" />
        <div className="h-4 bg-white/5 rounded-lg w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-white/5 rounded-lg w-24" />
          <div className="h-4 bg-white/5 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}

export function KitGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <KitSkeleton key={i} />
      ))}
    </div>
  );
}
