import { describe, it, expect } from "vitest";
import type { Product } from "@/lib/types";
describe("types", () => {
  it("Product shape is usable", () => {
    const p: Product = { id:"1", slug:"a", name:"A", description:"", category:"c", subcategory:"", price:10, compareAtPrice:null, costPerItem:null, images:[], videos:[], variants:[], totalStock:0, lowStockThreshold:5, status:"active", createdAt:"2026-01-01" };
    expect(p.id).toBe("1");
  });
});
