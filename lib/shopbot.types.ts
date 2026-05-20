// Currently mirroring lib/types.ts, but will diverge as ShopBot's schema becomes the source of truth.

export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export interface Variant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  compare_at_price: number | null;
  cost_per_item: number | null;
  images: string[];
  videos: string[];
  variants: Variant[];
  total_stock: number;
  low_stock_threshold: number;
  status: ProductStatus;
  created_at: string;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  featured: boolean;
  product_count: number;
}
export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
}
export interface Order {
  id: string;
  customer: string;
  email: string;
  country: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping_method: string;
  shipping: number;
  payment_method: string;
  total: number;
}
export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
}
export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  eta: string;
}
export interface Banner {
  id: string;
  image: string;
  title: string;
  cta: string;
  href: string;
  order: number;
}
export interface SwiperSlide {
  id: string;
  image: string;
  title: string;
  href: string;
  order: number;
}
export interface WebsiteSection {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
}
export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  total_products: number;
  active_products: number;
  low_stock_count: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
}

export interface SalesAnalytics {
  period: string;
  data: { date: string; revenue: number; orders: number }[];
}

// Auth
export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    is_admin: boolean;
  };
}


export interface CartLineItem {
    product_id: string;
    qty: number;
    size?: string;
    color?: string;
  }
  
  export interface CartUpdateRequest {
    store_slug: string;
    session_id: string;
    items: CartLineItem[];
  }
  
  export interface CartUpdateResponse {
    ok: boolean;
    cart_id: string;
  }
  
// Generic API Error
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
