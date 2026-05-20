import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCart } from "@/stores/cart";
import type { CartLine } from "@/lib/types";

describe("cart mirror to ShopBot", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("add triggers POST to /api/cart with new line item", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    useCart.getState().reset();

    const line: CartLine = {
      productId: "prod-123",
      slug: "test-product",
      name: "Test Product",
      image: "/test.jpg",
      price: 49.99,
      qty: 1,
      size: "M",
      color: "Black",
    };

    useCart.getState().add(line);

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ "Content-Type": "application/json" }),
      body: expect.stringContaining("prod-123"),
    }));
  });

  it("remove triggers POST to /api/cart with updated items", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    useCart.getState().reset();

    const line: CartLine = {
      productId: "prod-123",
      slug: "test-product",
      name: "Test Product",
      image: "/test.jpg",
      price: 49.99,
      qty: 1,
      size: "M",
      color: "Black",
    };

    useCart.getState().add(line);
    fetchSpy.mockClear();

    useCart.getState().remove(0);

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart", expect.objectContaining({
      method: "POST",
    }));
  });

  it("setQty triggers POST to /api/cart with updated quantity", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    useCart.getState().reset();

    const line: CartLine = {
      productId: "prod-123",
      slug: "test-product",
      name: "Test Product",
      image: "/test.jpg",
      price: 49.99,
      qty: 1,
      size: "M",
      color: "Black",
    };

    useCart.getState().add(line);
    fetchSpy.mockClear();

    useCart.getState().setQty(0, 3);

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart", expect.objectContaining({
      method: "POST",
      body: expect.stringContaining("3"),
    }));
  });

  it("clear triggers POST to /api/cart with empty items", async () => {
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    useCart.getState().reset();

    const line: CartLine = {
      productId: "prod-123",
      slug: "test-product",
      name: "Test Product",
      image: "/test.jpg",
      price: 49.99,
      qty: 1,
      size: "M",
      color: "Black",
    };

    useCart.getState().add(line);
    fetchSpy.mockClear();

    useCart.getState().clear();

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart", expect.objectContaining({
      method: "POST",
      body: expect.stringContaining("[]"),
    }));
  });
});