import { describe, it, expect, vi } from "vitest";
import { ShopBotClient } from "@/lib/shopbot";

describe("ShopBotClient", () => {
  it("attaches JWT to authenticated requests", async () => {
    const fetchSpy = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const c = new ShopBotClient({ baseUrl: "http://api", token: "xyz", fetch: fetchSpy });
    await c.get("/dashboard/products");
    const init = fetchSpy.mock.calls[0]?.[1];
    const headers = init?.headers as Headers | undefined;
    expect(headers?.get("Authorization")).toBe("Bearer xyz");
  });
  it("normalizes non-2xx into a typed ApiError", async () => {
    const fetchSpy = vi.fn(async () => new Response("nope", { status: 401 }));
    const c = new ShopBotClient({ baseUrl: "http://api", fetch: fetchSpy });
    await expect(c.get("/dashboard/products")).rejects.toMatchObject({ status: 401 });
  });
});
