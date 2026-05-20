"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useHydrated } from "@/lib/use-hydrated";
import { useCatalog } from "@/stores/catalog";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductCardSkeleton } from "@/components/storefront/product-card-skeleton";
import { FiltersSidebar } from "@/components/storefront/filters-sidebar";
import type { FilterState } from "@/lib/filter";
import { applyFilters } from "@/lib/filter";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const hydrated = useHydrated();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    sizes: [],
    min: 0,
    max: 1e9,
    inStock: false,
    sort: "newest",
  });

  useEffect(() => {
    const category = searchParams.get("category") || "";
    if (category) {
      setFilters((prev) => ({ ...prev, category }));
    }
  }, [searchParams]);

  const products = useCatalog((state) => state.products);

  const filteredProducts = useMemo(() => {
    return applyFilters(products, filters);
  }, [products, filters]);

  const showMore = () => {
    setVisible((v) => v + PAGE_SIZE);
  };

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide">
            {filters.category || "All Products"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-mute hidden md:block">
              {filteredProducts.length} products
            </span>
            <div className="hidden md:flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-mute" />
              <Select
                value={filters.sort}
                onValueChange={(val) =>
                  setFilters({ ...filters, sort: val as FilterState["sort"] })
                }
              >
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between mb-4">
          <span className="text-sm text-mute">
            {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  Sort
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Sort By</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setFilters({ ...filters, sort: opt.value as FilterState["sort"] })
                      }
                      className={`w-full text-left px-4 py-2 text-sm rounded-sm ${
                        filters.sort === opt.value
                          ? "bg-soft-cloud font-medium"
                          : "hover:bg-soft-cloud"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-mute text-lg">No products found</p>
                <p className="text-mute text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProducts.slice(0, visible).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {visible < filteredProducts.length && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={showMore}
                      className="min-w-44"
                    >
                      Load More
                    </Button>
                    <p className="text-xs text-mute mt-2">
                      Showing {visible} of {filteredProducts.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}