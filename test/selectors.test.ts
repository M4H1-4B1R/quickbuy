import { describe, it, expect } from "vitest";
import { dashboardStats, lowStock } from "@/lib/selectors";
import { seedProducts, seedOrders } from "@/lib/mock-data";
describe("selectors", () => {
  it("totals revenue from orders", () => {
    const s = dashboardStats(seedProducts, seedOrders);
    expect(s.totalRevenue).toBe(seedOrders.reduce((a,o)=>a+o.total,0));
    expect(s.totalOrders).toBe(seedOrders.length);
  });
  it("lowStock returns products at/under threshold", () => {
    const ls = lowStock(seedProducts);
    expect(ls.every(p => p.totalStock <= p.lowStockThreshold)).toBe(true);
  });
});
