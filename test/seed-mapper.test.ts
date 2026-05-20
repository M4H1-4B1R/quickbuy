import { describe, it, expect } from "vitest";
import { mapDjangoToShopBot, type DjangoDump, type ShopBotPayload } from "@/scripts/seed-from-dump";

describe("seed-mapper", () => {
  const minimalDump: DjangoDump = [
    {
      model: "api.category",
      pk: 1,
      fields: {
        name: "Apparel",
        name_ar: "ملابس",
        slug: "apparel",
        parent: null,
        description: "Clothing category",
        description_ar: "",
        image: "https://example.com/apparel.jpg",
        featured: true,
        created_at: "2025-01-01T00:00:00Z",
      },
    },
    {
      model: "api.product",
      pk: 1,
      fields: {
        name: "Test T-Shirt",
        name_ar: "",
        description: "A test product",
        description_ar: "",
        description2: "More details",
        base_price: 29.99,
        discount_price: 24.99,
        slug: "test-t-shirt",
        image: "https://example.com/tshirt.jpg",
        stock: 100,
        is_available: true,
        best_seller: false,
        inventory_mode: "single",
        categories: [1],
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    },
    {
      model: "api.coupon",
      pk: 1,
      fields: {
        code: "TEST10",
        discount_type: "percent",
        discount_value: 10,
        usage_limit: 100,
        used_count: 0,
        valid_until: "2026-12-31T23:59:59Z",
        is_active: true,
        minimum_order_amount: 50,
      },
    },
    {
      model: "api.shippingoption",
      pk: 1,
      fields: {
        name: "Standard",
        name_ar: "",
        description: "Standard shipping",
        description_ar: "",
        price: 5.99,
        estimated_days: 7,
        is_active: true,
      },
    },
    {
      model: "api.bannerswiper",
      pk: 1,
      fields: {
        title: "Test Banner",
        title_ar: "",
        subtitle: "Test subtitle",
        subtitle_ar: "",
        file: "https://example.com/banner.jpg",
        link: "/shop",
        is_active: true,
        order: 1,
      },
    },
  ];

  it("maps Django category to ShopBot format", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0]).toMatchObject({
      name: "Apparel",
      slug: "apparel",
      image: "https://example.com/apparel.jpg",
      featured: true,
      product_count: 0,
    });
  });

  it("maps Django product to ShopBot format", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      name: "Test T-Shirt",
      slug: "test-t-shirt",
      description: "A test product\n\nMore details",
      category: "Apparel",
      price: 2999,
      compare_at_price: 2499,
      image: "https://example.com/tshirt.jpg",
      stock: 100,
      is_active: true,
    });
  });

  it("maps Django coupon to ShopBot format", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.coupons).toHaveLength(1);
    expect(result.coupons[0]).toMatchObject({
      code: "TEST10",
      type: "percent",
      value: 10,
      min_order: 5000,
      max_uses: 100,
      used_count: 0,
      expires_at: "2026-12-31T23:59:59Z",
      is_active: true,
    });
  });

  it("maps Django shipping to ShopBot format", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.shipping).toHaveLength(1);
    expect(result.shipping[0]).toMatchObject({
      name: "Standard",
      price: 599,
      delivery_time_label: "7 days",
      is_active: true,
    });
  });

  it("maps Django banner to ShopBot format", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.banners).toHaveLength(1);
    expect(result.banners[0]).toMatchObject({
      title: "Test Banner",
      subtitle: "Test subtitle",
      media_url: "https://example.com/banner.jpg",
      link_url: "/shop",
      sort_order: 1,
      is_live: true,
    });
  });

  it("drops Arabic fields", () => {
    const result = mapDjangoToShopBot(minimalDump);
    const product = result.products[0];
    expect(product).not.toHaveProperty("name_ar");
  });

  it("converts prices to cents", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.products[0].price).toBe(2999);
    expect(result.products[0].compare_at_price).toBe(2499);
  });

  it("inverts is_available to is_active", () => {
    const result = mapDjangoToShopBot(minimalDump);
    expect(result.products[0].is_active).toBe(true);
  });
});