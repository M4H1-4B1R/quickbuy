import { ProductCardSkeleton } from "@/components/storefront/product-card-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="space-y-4">
          <div className="bg-hairline-soft aspect-square animate-pulse rounded-sm" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-hairline-soft w-20 h-20 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-10 w-3/4 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-6 w-32 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-px bg-hairline-soft" />
          <div className="h-12 w-full bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-12 w-full bg-hairline-soft animate-pulse rounded-sm" />
        </div>
      </div>
      <div className="mb-6">
        <div className="h-8 w-48 bg-hairline-soft animate-pulse rounded-sm mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}