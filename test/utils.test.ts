import { describe, it, expect } from "vitest";
import { slugify, formatMoney } from "@/lib/utils";
describe("utils", () => {
  it("slugify lowercases and dashes", () => {
    expect(slugify("Neil Barret X Alpha Jacket")).toBe("neil-barret-x-alpha-jacket");
  });
  it("slugify strips punctuation", () => {
    expect(slugify("  Men's  Shoes!! ")).toBe("mens-shoes");
  });
  it("formatMoney formats USD", () => {
    expect(formatMoney(60)).toBe("$60.00");
  });
});
