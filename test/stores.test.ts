import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "@/stores/cart";
import { useUi } from "@/stores/ui";

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
    expect(useCart.getState().lines[0]?.qty).toBe(2);
  });
});

describe("ui store", () => {
  it("toggles mobile menu", () => {
    expect(useUi.getState().isMobileMenuOpen).toBe(false);
    useUi.getState().toggleMobileMenu();
    expect(useUi.getState().isMobileMenuOpen).toBe(true);
    useUi.getState().toggleMobileMenu();
    expect(useUi.getState().isMobileMenuOpen).toBe(false);
  });
});