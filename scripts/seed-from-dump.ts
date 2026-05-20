import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { ShopBotClient } from "../lib/shopbot";

export interface DjangoCategoryFields {
  name: string;
  name_ar: string;
  slug: string;
  parent: number | null;
  description: string;
  description_ar: string;
  image: string;
  featured: boolean;
  created_at: string;
}

export interface DjangoProductFields {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  description2: string;
  base_price: number;
  discount_price: number | null;
  slug: string;
  image: string;
  stock: number;
  is_available: boolean;
  best_seller: boolean;
  inventory_mode: string;
  categories: number[];
  created_at: string;
  updated_at: string;
}

export interface DjangoCouponFields {
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  used_count: number;
  valid_until: string;
  is_active: boolean;
  minimum_order_amount: number;
}

export interface DjangoShippingFields {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
}

export interface DjangoBannerFields {
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  file: string;
  link: string;
  is_active: boolean;
  order: number;
}

export interface DjangoSwiperFields {
  title: string;
  title_ar: string;
  subtitle: string;
  subtitle_ar: string;
  image: string;
  icon: string;
  link: string;
  is_active: boolean;
  order: number;
}

export interface DjangoNewsletterFields {
  full_name: string;
  email: string;
  created_at: string;
}

export interface DjangoDumpRecord {
  model: string;
  pk: number;
  fields:
    | DjangoCategoryFields
    | DjangoProductFields
    | DjangoCouponFields
    | DjangoShippingFields
    | DjangoBannerFields
    | DjangoSwiperFields
    | DjangoNewsletterFields;
}

export type DjangoDump = DjangoDumpRecord[];

export interface ShopBotCategory {
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  product_count: number;
}

export interface ShopBotProduct {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  image: string;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface ShopBotCoupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string;
  is_active: boolean;
}

export interface ShopBotShipping {
  name: string;
  price: number;
  delivery_time_label: string;
  is_active: boolean;
}

export interface ShopBotBanner {
  title: string;
  subtitle: string;
  media_url: string;
  link_url: string;
  sort_order: number;
  is_live: boolean;
}

export interface ShopBotSwiper {
  image: string;
  title: string;
  href: string;
  order: number;
}

export interface ShopBotNewsletter {
  contact: string;
}

export interface ShopBotPayload {
  categories: ShopBotCategory[];
  products: ShopBotProduct[];
  coupons: ShopBotCoupon[];
  shipping: ShopBotShipping[];
  banners: ShopBotBanner[];
  swipers: ShopBotSwiper[];
  newsletters: ShopBotNewsletter[];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getCategoryMap(dump: DjangoDump): Map<number, string> {
  const map = new Map<number, string>();
  const categories = dump.filter((r) => r.model === "api.category");
  for (const cat of categories) {
    const fields = cat.fields as DjangoCategoryFields;
    map.set(cat.pk, fields.name);
  }
  return map;
}

export function mapDjangoToShopBot(dump: DjangoDump): ShopBotPayload {
  const payload: ShopBotPayload = {
    categories: [],
    products: [],
    coupons: [],
    shipping: [],
    banners: [],
    swipers: [],
    newsletters: [],
  };

  const categoryMap = getCategoryMap(dump);

  for (const record of dump) {
    switch (record.model) {
      case "api.category": {
        const f = record.fields as DjangoCategoryFields;
        payload.categories.push({
          name: f.name,
          slug: f.slug || slugify(f.name),
          image: f.image,
          featured: f.featured,
          product_count: 0,
        });
        break;
      }

      case "api.product": {
        const f = record.fields as DjangoProductFields;
        const categoryId = f.categories?.[0];
        const categoryName = categoryId ? categoryMap.get(categoryId) ?? "" : "";

        const description = f.description
          ? f.description2
            ? `${f.description}\n\n${f.description2}`
            : f.description
          : f.description2 || "";

        payload.products.push({
          name: f.name,
          slug: f.slug || slugify(f.name),
          description,
          category: categoryName,
          price: Math.round(f.base_price * 100),
          compare_at_price: f.discount_price
            ? Math.round(f.discount_price * 100)
            : null,
          image: f.image,
          stock: f.stock,
          is_active: f.is_available,
          created_at: f.created_at,
        });
        break;
      }

      case "api.coupon": {
        const f = record.fields as DjangoCouponFields;
        const isPercent = f.discount_type === "percent";
        payload.coupons.push({
          code: f.code,
          type: isPercent ? "percent" : "fixed",
          value: isPercent ? Math.round(f.discount_value) : Math.round(f.discount_value * 100),
          min_order: Math.round((f.minimum_order_amount || 0) * 100),
          max_uses: f.usage_limit || null,
          used_count: f.used_count,
          expires_at: f.valid_until,
          is_active: f.is_active,
        });
        break;
      }

      case "api.shippingoption": {
        const f = record.fields as DjangoShippingFields;
        payload.shipping.push({
          name: f.name,
          price: Math.round(f.price * 100),
          delivery_time_label: `${f.estimated_days} days`,
          is_active: f.is_active,
        });
        break;
      }

      case "api.bannerswiper": {
        const f = record.fields as DjangoBannerFields;
        payload.banners.push({
          title: f.title,
          subtitle: f.subtitle,
          media_url: f.file,
          link_url: f.link,
          sort_order: f.order,
          is_live: f.is_active,
        });
        break;
      }

      case "api.swiper": {
        const f = record.fields as DjangoSwiperFields;
        payload.swipers.push({
          image: f.image,
          title: f.title,
          href: f.link,
          order: f.order,
        });
        break;
      }

      case "api.emailnewsletter": {
        const f = record.fields as DjangoNewsletterFields;
        payload.newsletters.push({
          contact: f.email,
        });
        break;
      }
    }
  }

  return payload;
}

export async function seedToShopBot(
  client: ShopBotClient,
  payload: ShopBotPayload,
  logger: (msg: string) => void
) {
  const results = {
    categories: 0,
    products: 0,
    coupons: 0,
    shipping: 0,
    banners: 0,
    swipers: 0,
    newsletters: 0,
  };

  logger("Importing categories...");
  logger("  Categories are stored as product category field in ShopBot, skipping bulk import");
  results.categories = payload.categories.length;

  logger("Importing products...");
  for (const product of payload.products) {
    try {
      await client.products.create(product);
      results.products++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Product ${product.name} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  logger("Importing coupons...");
  for (const coupon of payload.coupons) {
    try {
      await client.coupons.create(coupon);
      results.coupons++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Coupon ${coupon.code} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  logger("Importing shipping options...");
  for (const ship of payload.shipping) {
    try {
      await client.shipping.create(ship);
      results.shipping++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Shipping ${ship.name} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  logger("Importing banners...");
  for (const banner of payload.banners) {
    try {
      await client.banners.create(banner);
      results.banners++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Banner ${banner.title} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  logger("Importing swiper slides...");
  for (const swiper of payload.swipers) {
    try {
      await client.gallery.create(swiper);
      results.swipers++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Swiper slide already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  logger("Importing newsletter subscribers...");
  for (const sub of payload.newsletters) {
    try {
      await client.newsletters.add(sub.contact);
      results.newsletters++;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes("UNIQUE constraint failed")
      ) {
        logger(`  Subscriber ${sub.contact} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const wipe = args.includes("--wipe");

  const shopbotApi = process.env.SHOPBOT_API || "http://localhost:4100";
  const storeJwt = process.env.SHOPBOT_STORE_JWT;

  if (!storeJwt) {
    console.error("Error: SHOPBOT_STORE_JWT environment variable is required");
    console.error("Usage: SHOPBOT_STORE_JWT=<jwt> npm run seed [-- --wipe]");
    process.exit(1);
  }

  const client = new ShopBotClient({
    baseUrl: shopbotApi,
    token: storeJwt,
  });

  const fixturePath = resolve(join(__dirname, "fixtures", "roadsters-seed.json"));

  if (!existsSync(fixturePath)) {
    console.error(`Error: Fixture file not found at ${fixturePath}`);
    process.exit(1);
  }

  const dump: DjangoDump = JSON.parse(readFileSync(fixturePath, "utf-8"));
  console.log(`Loaded ${dump.length} records from fixture`);

  if (wipe) {
    console.log("Wiping store data...");
    try {
      await client.store.wipe();
      console.log("Store wiped successfully");
    } catch (err) {
      console.error("Warning: Store wipe failed (endpoint may not exist yet):", err);
    }
  }

  console.log("Mapping Django dump to ShopBot format...");
  const payload = mapDjangoToShopBot(dump);
  console.log(`Mapped: ${payload.categories.length} categories, ${payload.products.length} products, ${payload.coupons.length} coupons, ${payload.shipping.length} shipping, ${payload.banners.length} banners, ${payload.swipers.length} swipers, ${payload.newsletters.length} newsletters`);

  console.log("Seeding to ShopBot...");
  const results = await seedToShopBot(client, payload, (msg) => console.log(msg));

  console.log("\n=== Import Summary ===");
  console.log(`Categories: ${results.categories}`);
  console.log(`Products: ${results.products}`);
  console.log(`Coupons: ${results.coupons}`);
  console.log(`Shipping: ${results.shipping}`);
  console.log(`Banners: ${results.banners}`);
  console.log(`Swipers: ${results.swipers}`);
  console.log(`Newsletters: ${results.newsletters}`);
  console.log("======================");
  console.log("Done!");
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}