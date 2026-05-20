import { describe, it, expect } from "vitest";
import { applyFilters } from "@/lib/filter";
import { seedProducts } from "@/lib/mock-data";

describe("applyFilters", () => {
  it("filters by category", () => {
    const r = applyFilters(seedProducts, { category: "Footwear", sizes: [], min: 0, max: 1e9, inStock: false, sort: "newest" });
    expect(r.every((p) => p.category === "Footwear")).toBe(true);
  });

  it("sorts price low-high", () => {
    const r = applyFilters(seedProducts, { category: "", sizes: [], min: 0, max: 1e9, inStock: false, sort: "price-asc" });
    for (let i = 1; i < r.length; i++) expect(r[i]!.price).toBeGreaterThanOrEqual(r[i - 1]!.price);
  });

  it("inStock excludes zero-stock", () => {
    const r = applyFilters(seedProducts, { category: "", sizes: [], min: 0, max: 1e9, inStock: true, sort: "newest" });
    expect(r.every((p) => p.totalStock > 0)).toBe(true);
  });
});