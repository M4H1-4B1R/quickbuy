"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useCatalog } from "@/stores/catalog";
import { formatMoney } from "@/lib/utils";
import type { FilterState } from "@/lib/filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "38", "39", "40", "41", "42", "43", "44", "45"];

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const categories = useCatalog.getState().categories;
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.min, filters.max === 1e9 ? 1000 : filters.max]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([filters.min, filters.max === 1e9 ? 1000 : filters.max]);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange({ ...localFilters, min: priceRange[0], max: priceRange[1] === 1000 ? 1e9 : priceRange[1] });
  };

  const handleReset = () => {
    const reset: FilterState = { category: "", sizes: [], min: 0, max: 1e9, inStock: false, sort: "newest" };
    setLocalFilters(reset);
    setPriceRange([0, 1000]);
    onFiltersChange(reset);
  };

  const toggleSize = (size: string) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter((s) => s !== size)
      : [...localFilters.sizes, size];
    setLocalFilters({ ...localFilters, sizes: newSizes });
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm uppercase tracking-wide">Filters</h3>
        <button onClick={handleReset} className="text-xs text-mute hover:text-ink underline">
          Reset
        </button>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-wide mb-3 text-mute">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={localFilters.category === ""}
              onChange={() => setLocalFilters({ ...localFilters, category: "" })}
              className="accent-ink"
            />
            <span className="text-sm">All</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={localFilters.category === cat.name}
                onChange={() => setLocalFilters({ ...localFilters, category: cat.name })}
                className="accent-ink"
              />
              <span className="text-sm">{cat.name}</span>
              <span className="text-xs text-mute">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-wide mb-3 text-mute">Size</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs border rounded-sm transition-colors ${
                localFilters.sizes.includes(size)
                  ? "bg-ink text-canvas border-ink"
                  : "bg-canvas border-hairline-soft hover:border-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-wide mb-3 text-mute">Price Range</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="mt-2"
        />
        <div className="flex justify-between mt-2 text-xs text-mute">
          <span>{formatMoney(priceRange[0])}</span>
          <span>{priceRange[1] >= 1000 ? "$1000+" : formatMoney(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock" className="text-xs font-medium uppercase tracking-wide">
            In Stock Only
          </Label>
          <Switch
            id="in-stock"
            checked={localFilters.inStock}
            onCheckedChange={(checked) => setLocalFilters({ ...localFilters, inStock: checked })}
          />
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20">
          {content}
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {content}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}