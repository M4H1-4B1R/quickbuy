import type { Product } from "@/lib/types";

export interface FilterState {
  category: string;
  sizes: string[];
  min: number;
  max: number;
  inStock: boolean;
  sort: "newest" | "price-asc" | "price-desc";
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  let result = products.filter((p) => {
    if (p.status !== "active") return false;

    if (f.category && p.category !== f.category) return false;

    if (f.sizes.length > 0) {
      const productSizes = new Set(p.variants.map((v) => v.size));
      if (!f.sizes.some((s) => productSizes.has(s))) return false;
    }

    if (f.min > 0 && p.price < f.min) return false;
    if (f.max < 1e9 && p.price > f.max) return false;

    if (f.inStock && p.totalStock <= 0) return false;

    return true;
  });

  switch (f.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  return result;
}