import type {
  Product,
  Category,
  Order,
  Coupon,
  ShippingOption,
  Banner,
  SwiperSlide,
  WebsiteSection,
  NewsletterSubscriber,
  Variant,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

// ---------- Categories ----------
const categoryNames = [
  "Apparel",
  "Footwear",
  "Accessories",
  "Bags",
  "Outerwear",
  "Activewear",
  "Home",
  "Lifestyle",
] as const;

export const seedCategories: Category[] = categoryNames.map((name, i) => {
  const slug = slugify(name);
  return {
    id: `cat-${i + 1}`,
    name,
    slug,
    image: `https://picsum.photos/seed/${slug}/800/800`,
    featured: name === "Apparel" || name === "Footwear",
    productCount: 0, // filled in after products defined
  };
});

// ---------- Helpers ----------
function makeImages(slug: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${slug}-${i + 1}/800/800`);
}

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];

function apparelVariants(colors: string[], baseStock: number): Variant[] {
  const out: Variant[] = [];
  for (const c of colors) {
    for (const s of APPAREL_SIZES) {
      out.push({
        size: s,
        color: c,
        stock: baseStock + ((s.length + c.length) % 7),
        sku: `${slugify(c)}-${s}`,
      });
    }
  }
  return out;
}

function shoeVariants(colors: string[], baseStock: number): Variant[] {
  const out: Variant[] = [];
  for (const c of colors) {
    for (const s of SHOE_SIZES) {
      out.push({
        size: s,
        color: c,
        stock: baseStock + ((Number(s) + c.length) % 5),
        sku: `${slugify(c)}-${s}`,
      });
    }
  }
  return out;
}

function sumStock(v: Variant[]): number {
  return v.reduce((a, x) => a + x.stock, 0);
}

type ProductSeed = {
  name: string;
  category: typeof categoryNames[number];
  subcategory: string;
  description: string;
  price: number;
  compareAt?: number;
  cost?: number;
  imageCount?: number;
  videos?: string[];
  variants?: Variant[];
  totalStock?: number; // for variantless products
  status?: Product["status"];
  createdAt?: string;
};

const seedSpecs: ProductSeed[] = [
  // Apparel (5)
  {
    name: "Classic Cotton Tee",
    category: "Apparel",
    subcategory: "T-Shirts",
    description: "Soft 100% cotton tee with a relaxed fit.",
    price: 24,
    compareAt: 32,
    cost: 8,
    variants: apparelVariants(["Black", "White", "Navy"], 6),
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    name: "Linen Button Shirt",
    category: "Apparel",
    subcategory: "Shirts",
    description: "Breathable linen shirt for warm days.",
    price: 58,
    cost: 18,
    variants: apparelVariants(["Beige", "White"], 4),
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    name: "Slim Fit Chinos",
    category: "Apparel",
    subcategory: "Pants",
    description: "Versatile chinos that go from desk to dinner.",
    price: 72,
    compareAt: 95,
    cost: 22,
    variants: apparelVariants(["Khaki", "Olive", "Navy"], 5),
    createdAt: "2026-03-08T10:00:00.000Z",
  },
  {
    name: "Knit Crew Sweater",
    category: "Apparel",
    subcategory: "Knitwear",
    description: "Lightweight knit sweater in heathered tones.",
    price: 89,
    cost: 28,
    variants: apparelVariants(["Charcoal", "Cream"], 3),
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    name: "Pleated Midi Skirt",
    category: "Apparel",
    subcategory: "Skirts",
    description: "Flowing pleated midi for effortless style.",
    price: 64,
    compareAt: 80,
    cost: 19,
    variants: apparelVariants(["Black", "Burgundy"], 4),
    createdAt: "2026-03-14T10:00:00.000Z",
  },

  // Footwear (4)
  {
    name: "Everyday Leather Sneaker",
    category: "Footwear",
    subcategory: "Sneakers",
    description: "Minimalist leather sneaker for daily wear.",
    price: 120,
    compareAt: 160,
    cost: 42,
    variants: shoeVariants(["White", "Black"], 4),
    createdAt: "2026-03-15T10:00:00.000Z",
  },
  {
    name: "Trail Runner Pro",
    category: "Footwear",
    subcategory: "Running",
    description: "Grippy trail runner with cushioned midsole.",
    price: 145,
    cost: 55,
    variants: shoeVariants(["Black/Red", "Grey"], 3),
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    name: "Suede Chelsea Boot",
    category: "Footwear",
    subcategory: "Boots",
    description: "Refined suede chelsea boots with elastic gore.",
    price: 185,
    compareAt: 240,
    cost: 68,
    variants: shoeVariants(["Tan", "Espresso"], 2),
    createdAt: "2026-03-20T10:00:00.000Z",
  },
  {
    name: "Canvas Slip-On",
    category: "Footwear",
    subcategory: "Casual",
    description: "Easy canvas slip-ons for relaxed weekends.",
    price: 55,
    cost: 18,
    variants: shoeVariants(["Navy", "Off-White"], 5),
    createdAt: "2026-03-22T10:00:00.000Z",
  },

  // Accessories (3)
  {
    name: "Woven Leather Belt",
    category: "Accessories",
    subcategory: "Belts",
    description: "Hand-woven leather belt with brass buckle.",
    price: 48,
    cost: 14,
    totalStock: 60,
    status: "active",
    createdAt: "2026-03-25T10:00:00.000Z",
  },
  {
    name: "Cashmere Scarf",
    category: "Accessories",
    subcategory: "Scarves",
    description: "Pure cashmere scarf, lightweight and warm.",
    price: 95,
    compareAt: 130,
    cost: 32,
    totalStock: 40,
    createdAt: "2026-03-27T10:00:00.000Z",
  },
  {
    name: "Polarized Aviators",
    category: "Accessories",
    subcategory: "Sunglasses",
    description: "Polarized aviator sunglasses with metal frame.",
    price: 75,
    cost: 22,
    totalStock: 80,
    videos: ["https://samplelib.com/lib/preview/mp4/sample-5s.mp4"],
    createdAt: "2026-03-29T10:00:00.000Z",
  },

  // Bags (3)
  {
    name: "Daily Tote Bag",
    category: "Bags",
    subcategory: "Totes",
    description: "Spacious canvas tote with leather handles.",
    price: 68,
    cost: 24,
    totalStock: 55,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    name: "Commuter Backpack",
    category: "Bags",
    subcategory: "Backpacks",
    description: "Water-resistant backpack with laptop sleeve.",
    price: 140,
    compareAt: 180,
    cost: 48,
    totalStock: 35,
    createdAt: "2026-04-02T10:00:00.000Z",
  },
  {
    name: "Leather Crossbody",
    category: "Bags",
    subcategory: "Crossbody",
    description: "Full-grain leather crossbody bag.",
    price: 165,
    cost: 60,
    totalStock: 25,
    createdAt: "2026-04-03T10:00:00.000Z",
  },

  // Outerwear (3)
  {
    name: "Quilted Bomber Jacket",
    category: "Outerwear",
    subcategory: "Jackets",
    description: "Insulated bomber with ribbed cuffs.",
    price: 195,
    compareAt: 260,
    cost: 72,
    variants: apparelVariants(["Black", "Olive"], 3),
    createdAt: "2026-04-04T10:00:00.000Z",
  },
  {
    name: "Wool Overcoat",
    category: "Outerwear",
    subcategory: "Coats",
    description: "Tailored wool overcoat for cold weather.",
    price: 320,
    cost: 120,
    variants: apparelVariants(["Camel", "Charcoal"], 2),
    createdAt: "2026-04-06T10:00:00.000Z",
  },
  {
    name: "Rain Shell Anorak",
    category: "Outerwear",
    subcategory: "Rainwear",
    description: "Lightweight packable rain shell.",
    price: 110,
    cost: 38,
    variants: apparelVariants(["Yellow", "Navy"], 4),
    createdAt: "2026-04-08T10:00:00.000Z",
  },

  // Activewear (3)
  {
    name: "Performance Training Tee",
    category: "Activewear",
    subcategory: "Tops",
    description: "Moisture-wicking training tee.",
    price: 38,
    cost: 12,
    variants: apparelVariants(["Black", "Grey", "Blue"], 6),
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    name: "High-Rise Yoga Legging",
    category: "Activewear",
    subcategory: "Bottoms",
    description: "Buttery-soft yoga leggings with hidden pocket.",
    price: 78,
    compareAt: 98,
    cost: 25,
    variants: apparelVariants(["Black", "Plum"], 5),
    createdAt: "2026-04-12T10:00:00.000Z",
  },
  {
    name: "Lightweight Running Short",
    category: "Activewear",
    subcategory: "Shorts",
    description: "Quick-dry running shorts with liner.",
    price: 44,
    cost: 14,
    variants: apparelVariants(["Black", "Navy"], 5),
    createdAt: "2026-04-14T10:00:00.000Z",
  },

  // Home (2)
  {
    name: "Linen Throw Blanket",
    category: "Home",
    subcategory: "Textiles",
    description: "Stonewashed linen throw for the sofa.",
    price: 89,
    cost: 30,
    totalStock: 28,
    createdAt: "2026-04-16T10:00:00.000Z",
  },
  {
    name: "Ceramic Pour-Over Set",
    category: "Home",
    subcategory: "Kitchen",
    description: "Handcrafted ceramic pour-over coffee set.",
    price: 64,
    compareAt: 85,
    cost: 22,
    totalStock: 18,
    videos: ["https://samplelib.com/lib/preview/mp4/sample-10s.mp4"],
    createdAt: "2026-04-18T10:00:00.000Z",
  },

  // Lifestyle (2)
  {
    name: "Pocket Notebook Pair",
    category: "Lifestyle",
    subcategory: "Stationery",
    description: "Pair of dot-grid pocket notebooks.",
    price: 18,
    cost: 5,
    totalStock: 120,
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    name: "Travel Coffee Tumbler",
    category: "Lifestyle",
    subcategory: "Drinkware",
    description: "Insulated stainless tumbler keeps drinks hot 12h.",
    price: 32,
    compareAt: 42,
    cost: 10,
    totalStock: 90,
    createdAt: "2026-04-22T10:00:00.000Z",
  },
];

// Build products
export const seedProducts: Product[] = seedSpecs.map((s, i) => {
  const slug = slugify(s.name);
  const variants = s.variants ?? [];
  const totalStock = variants.length ? sumStock(variants) : s.totalStock ?? 0;
  return {
    id: `prod-${i + 1}`,
    slug,
    name: s.name,
    description: s.description,
    category: s.category,
    subcategory: s.subcategory,
    price: s.price,
    compareAtPrice: s.compareAt ?? null,
    costPerItem: s.cost ?? null,
    images: makeImages(slug, s.imageCount ?? 3),
    videos: s.videos ?? [],
    variants,
    totalStock,
    lowStockThreshold: 5,
    status: s.status ?? (i % 11 === 0 ? "draft" : "active"),
    createdAt: s.createdAt ?? "2026-04-01T10:00:00.000Z",
  };
});

// Update category productCount based on actual products
for (const c of seedCategories) {
  c.productCount = seedProducts.filter((p) => p.category === c.name).length;
}

// ---------- Orders ----------
const orderStatuses: Order["status"][] = ["pending", "processing", "shipped", "delivered"];

function buildOrder(
  idx: number,
  status: Order["status"],
  customer: string,
  email: string,
  itemSpecs: Array<{ productIdx: number; qty: number; size?: string; color?: string }>,
  shippingMethod: string,
  shipping: number,
  paymentMethod: string,
  country: string,
  date: string
): Order {
  const items = itemSpecs.map((it) => {
    const p = seedProducts[it.productIdx];
    if (!p) throw new Error(`seedProducts index ${it.productIdx} out of range`);
    return {
      productId: p.id,
      name: p.name,
      price: p.price,
      qty: it.qty,
      size: it.size,
      color: it.color,
    };
  });
  const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0);
  return {
    id: `ord-${1000 + idx}`,
    customer,
    email,
    country,
    date,
    status,
    items,
    shippingMethod,
    shipping,
    paymentMethod,
    total: subtotal + shipping,
  };
}

export const seedOrders: Order[] = [
  buildOrder(
    1,
    "pending",
    "Layla Haddad",
    "layla.h@example.com",
    [{ productIdx: 0, qty: 2, size: "M", color: "Black" }],
    "Standard Delivery 5 days",
    5,
    "Cash on Delivery",
    "Jordan",
    "2026-05-18T09:12:00.000Z"
  ),
  buildOrder(
    2,
    "pending",
    "Omar Khalil",
    "omar.k@example.com",
    [
      { productIdx: 5, qty: 1, size: "42", color: "White" },
      { productIdx: 9, qty: 1 },
    ],
    "Express 3 days",
    9,
    "Credit Card",
    "Jordan",
    "2026-05-18T14:40:00.000Z"
  ),
  buildOrder(
    3,
    "processing",
    "Sara Mansour",
    "sara.m@example.com",
    [{ productIdx: 12, qty: 1 }],
    "Fast Delivery 2 days",
    12,
    "Credit Card",
    "Jordan",
    "2026-05-17T11:05:00.000Z"
  ),
  buildOrder(
    4,
    "processing",
    "Yousef Ali",
    "yousef.a@example.com",
    [
      { productIdx: 2, qty: 1, size: "L", color: "Navy" },
      { productIdx: 18, qty: 1, size: "M", color: "Black" },
    ],
    "Standard Delivery 5 days",
    5,
    "Cash on Delivery",
    "Jordan",
    "2026-05-17T16:20:00.000Z"
  ),
  buildOrder(
    5,
    "shipped",
    "Hanan Saleh",
    "hanan.s@example.com",
    [{ productIdx: 7, qty: 1, size: "39", color: "Tan" }],
    "Express 3 days",
    9,
    "Credit Card",
    "Saudi Arabia",
    "2026-05-15T10:00:00.000Z"
  ),
  buildOrder(
    6,
    "shipped",
    "Karim Nassar",
    "karim.n@example.com",
    [
      { productIdx: 13, qty: 1 },
      { productIdx: 22, qty: 2 },
    ],
    "Standard Delivery 5 days",
    5,
    "Cash on Delivery",
    "Jordan",
    "2026-05-14T13:45:00.000Z"
  ),
  buildOrder(
    7,
    "delivered",
    "Noor Abu Rashid",
    "noor.a@example.com",
    [{ productIdx: 15, qty: 1, size: "M", color: "Olive" }],
    "Fast Delivery 2 days",
    12,
    "Credit Card",
    "UAE",
    "2026-05-10T09:00:00.000Z"
  ),
  buildOrder(
    8,
    "delivered",
    "Mariam Issa",
    "mariam.i@example.com",
    [
      { productIdx: 19, qty: 2, size: "S", color: "Plum" },
      { productIdx: 23, qty: 1 },
    ],
    "Standard Delivery 5 days",
    5,
    "Cash on Delivery",
    "Jordan",
    "2026-05-09T12:00:00.000Z"
  ),
  buildOrder(
    9,
    "delivered",
    "Tariq Younis",
    "tariq.y@example.com",
    [{ productIdx: 8, qty: 1, size: "43", color: "Off-White" }],
    "Express 3 days",
    9,
    "Credit Card",
    "Jordan",
    "2026-05-05T15:30:00.000Z"
  ),
  buildOrder(
    10,
    "delivered",
    "Rania Daoud",
    "rania.d@example.com",
    [
      { productIdx: 1, qty: 1, size: "S", color: "White" },
      { productIdx: 11, qty: 1 },
      { productIdx: 24, qty: 1 },
    ],
    "Fast Delivery 2 days",
    12,
    "Credit Card",
    "Jordan",
    "2026-05-02T08:20:00.000Z"
  ),
  buildOrder(
    11,
    "processing",
    "Adam Faris",
    "adam.f@example.com",
    [{ productIdx: 16, qty: 1, size: "L", color: "Camel" }],
    "Express 3 days",
    9,
    "Credit Card",
    "Jordan",
    "2026-05-19T07:00:00.000Z"
  ),
];

// ---------- Coupons ----------
export const seedCoupons: Coupon[] = [
  { id: "cpn-1", code: "WELCOME10", type: "percent", value: 10, active: true },
  { id: "cpn-2", code: "FREESHIP", type: "fixed", value: 5, active: true },
  { id: "cpn-3", code: "SUMMER20", type: "percent", value: 20, active: false },
];

// ---------- Shipping ----------
export const seedShipping: ShippingOption[] = [
  { id: "ship-1", name: "Standard Delivery", price: 5, eta: "5 days" },
  { id: "ship-2", name: "Express Delivery", price: 9, eta: "3 days" },
  { id: "ship-3", name: "Fast Delivery", price: 12, eta: "2 days" },
];

// ---------- Banners ----------
export const seedBanners: Banner[] = [
  {
    id: "ban-1",
    image: "https://picsum.photos/seed/banner-1/1600/600",
    title: "Spring Drop",
    cta: "Shop Now",
    href: "/category/apparel",
    order: 1,
  },
  {
    id: "ban-2",
    image: "https://picsum.photos/seed/banner-2/1600/600",
    title: "Step Into Style",
    cta: "Explore Footwear",
    href: "/category/footwear",
    order: 2,
  },
  {
    id: "ban-3",
    image: "https://picsum.photos/seed/banner-3/1600/600",
    title: "The Carry Edit",
    cta: "Browse Bags",
    href: "/category/bags",
    order: 3,
  },
];

// ---------- Swiper Slides ----------
export const seedSwiper: SwiperSlide[] = [
  {
    id: "swp-1",
    image: "https://picsum.photos/seed/swiper-1/1920/900",
    title: "New Season Essentials",
    href: "/category/apparel",
    order: 1,
  },
  {
    id: "swp-2",
    image: "https://picsum.photos/seed/swiper-2/1920/900",
    title: "Outerwear Heroes",
    href: "/category/outerwear",
    order: 2,
  },
  {
    id: "swp-3",
    image: "https://picsum.photos/seed/swiper-3/1920/900",
    title: "Move Better — Activewear",
    href: "/category/activewear",
    order: 3,
  },
  {
    id: "swp-4",
    image: "https://picsum.photos/seed/swiper-4/1920/900",
    title: "Home & Lifestyle",
    href: "/category/home",
    order: 4,
  },
];

// ---------- Website Sections ----------
export const seedWebsiteSections: WebsiteSection[] = [
  { id: "sec-1", key: "hero", label: "Hero", enabled: true },
  { id: "sec-2", key: "brand-strip", label: "Brand Strip", enabled: true },
  { id: "sec-3", key: "featured-categories", label: "Featured Categories", enabled: true },
  { id: "sec-4", key: "trending", label: "Trending", enabled: true },
  { id: "sec-5", key: "newsletter", label: "Newsletter", enabled: true },
];

// ---------- Subscribers ----------
export const seedSubscribers: NewsletterSubscriber[] = [
  { id: "sub-1", email: "early.bird@example.com", date: "2026-04-02T10:00:00.000Z" },
  { id: "sub-2", email: "fashion.fan@example.com", date: "2026-04-15T10:00:00.000Z" },
  { id: "sub-3", email: "weekend.shopper@example.com", date: "2026-05-01T10:00:00.000Z" },
];
