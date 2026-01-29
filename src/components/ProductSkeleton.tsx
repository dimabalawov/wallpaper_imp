"use client";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,2.5rem)]">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-xl" />
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex-1 h-48 bg-gray-200 animate-pulse rounded-xl" />
  );
}
