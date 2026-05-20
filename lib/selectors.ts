import type { Product, Order } from "./types";
export function lowStock(products: Product[]) {
  return products.filter(p => p.totalStock <= p.lowStockThreshold);
}
export function dashboardStats(products: Product[], orders: Order[]) {
  const totalRevenue = orders.reduce((a,o)=>a+o.total,0);
  return {
    totalRevenue,
    totalOrders: orders.length,
    avgOrder: orders.length ? totalRevenue/orders.length : 0,
    totalProducts: products.length,
    activeProducts: products.filter(p=>p.status==="active").length,
    lowStockCount: lowStock(products).length,
    statusDist: (["pending","processing","shipped","delivered"] as const)
      .map(s => ({ status:s, count: orders.filter(o=>o.status===s).length })),
  };
}
