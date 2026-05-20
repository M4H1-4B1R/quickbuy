export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export interface Variant { size: string; color: string; stock: number; sku: string; }
export interface Product {
  id: string; slug: string; name: string; description: string;
  category: string; subcategory: string;
  price: number; compareAtPrice: number | null; costPerItem: number | null;
  images: string[]; videos: string[]; variants: Variant[];
  totalStock: number; lowStockThreshold: number;
  status: ProductStatus; createdAt: string;
}
export interface Category { id: string; name: string; slug: string; image: string; featured: boolean; productCount: number; }
export interface OrderItem { productId: string; name: string; price: number; qty: number; size?: string; color?: string; }
export interface Order { id: string; customer: string; email: string; country: string; date: string; status: OrderStatus; items: OrderItem[]; shippingMethod: string; shipping: number; paymentMethod: string; total: number; }
export interface Coupon { id: string; code: string; type: "percent" | "fixed"; value: number; active: boolean; }
export interface ShippingOption { id: string; name: string; price: number; eta: string; }
export interface Banner { id: string; image: string; title: string; cta: string; href: string; order: number; }
export interface SwiperSlide { id: string; image: string; title: string; href: string; order: number; }
export interface WebsiteSection { id: string; key: string; label: string; enabled: boolean; }
export interface NewsletterSubscriber { id: string; email: string; date: string; }
export interface CartLine { productId: string; slug: string; name: string; image: string; price: number; qty: number; size: string; color: string; }
