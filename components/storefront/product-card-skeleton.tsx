import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="bg-hairline-soft aspect-square" />
      <div className="pt-3 pb-4 space-y-2">
        <Skeleton className="h-3 w-16 bg-hairline-soft" />
        <Skeleton className="h-4 w-3/4 bg-hairline-soft" />
        <Skeleton className="h-4 w-1/4 bg-hairline-soft" />
      </div>
    </div>
  );
}