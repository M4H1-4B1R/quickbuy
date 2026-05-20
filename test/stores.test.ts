import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/stores/auth";
import { useCatalog } from "@/stores/catalog";

beforeEach(() => { useCart.setState(useCart.getInitialState?.() ?? {}); localStorage.clear(); });

describe("cart store", () => {
  it("adds and totals lines", () => {
    useCart.getState().reset();
    useCart.getState().add({ productId:"1", slug:"a", name:"A", image:"", price:10, qty:2, size:"M", color:"Black" });
    expect(useCart.getState().count()).toBe(2);
    expect(useCart.getState().subtotal()).toBe(20);
  });
  it("merges same variant", () => {
    useCart.getState().reset();
    const l = { productId:"1", slug:"a", name:"A", image:"", price:10, qty:1, size:"M", color:"Black" };
    useCart.getState().add(l); useCart.getState().add(l);
    expect(useCart.getState().lines.length).toBe(1);
    expect(useCart.getState().lines[0].qty).toBe(2);
  });
});
describe("auth store", () => {
  it("logs in only with admin/admin", () => {
    expect(useAuth.getState().login("x","y")).toBe(false);
    expect(useAuth.getState().login("admin","admin")).toBe(true);
    expect(useAuth.getState().isAuthenticated).toBe(true);
  });
});
describe("catalog store", () => {
  it("seeds, adds, updates, deletes products", () => {
    useCatalog.getState().resetDemo();
    const before = useCatalog.getState().products.length;
    useCatalog.getState().addProduct({ name:"Zed Test", description:"", category:"Apparel", subcategory:"", price:5, compareAtPrice:null, costPerItem:null, images:[], variants:[], lowStockThreshold:5, status:"draft" });
    expect(useCatalog.getState().products.length).toBe(before + 1);
    const p = useCatalog.getState().products.find(x => x.name === "Zed Test")!;
    expect(p.slug).toBe("zed-test");
    useCatalog.getState().updateProduct(p.id, { price: 9 });
    expect(useCatalog.getState().products.find(x=>x.id===p.id)!.price).toBe(9);
    useCatalog.getState().deleteProduct(p.id);
    expect(useCatalog.getState().products.find(x=>x.id===p.id)).toBeUndefined();
  });
});
