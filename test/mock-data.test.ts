import { describe, it, expect } from "vitest";
import { seedProducts, seedOrders, seedCategories, seedCoupons, seedShipping } from "@/lib/mock-data";
describe("mock-data", () => {
  it("has >= 24 products", () => expect(seedProducts.length).toBeGreaterThanOrEqual(24));
  it("has >= 10 orders", () => expect(seedOrders.length).toBeGreaterThanOrEqual(10));
  it("has 8 categories", () => expect(seedCategories.length).toBe(8));
  it("product slugs are unique", () => {
    const s = seedProducts.map(p => p.slug);
    expect(new Set(s).size).toBe(s.length);
  });
  it("every product category exists in categories", () => {
    const names = new Set(seedCategories.map(c => c.name));
    expect(seedProducts.every(p => names.has(p.category))).toBe(true);
  });
  it("totalStock equals sum of variant stock when variants exist", () => {
    const withVar = seedProducts.filter(p => p.variants.length);
    expect(withVar.every(p => p.totalStock === p.variants.reduce((a,v)=>a+v.stock,0))).toBe(true);
  });
  it("orders span all statuses", () => {
    const st = new Set(seedOrders.map(o => o.status));
    ["pending","processing","shipped","delivered"].forEach(s => expect(st.has(s as any)).toBe(true));
  });
  it("exports coupons and shipping", () => {
    expect(seedCoupons.length).toBeGreaterThan(0);
    expect(seedShipping.length).toBeGreaterThan(0);
  });
});
