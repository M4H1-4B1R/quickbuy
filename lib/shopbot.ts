// SERVER-SIDE ONLY. Do not import this module from client components — it reads
// `SHOPBOT_API` and is constructed with the admin JWT pulled from an HttpOnly
// cookie. All cross-system calls to ShopBot funnel through this single chokepoint;
// route handlers under `app/api/*` are the only call sites.

import {
  ApiError,
  type LoginRequest,
  type LoginResponse,
  type Product,
  type Order,
  type Category,
  type CartUpdateRequest,
  type CartUpdateResponse,
  type Coupon,
  type ShippingOption,
  type Banner,
  type SwiperSlide,
  type WebsiteSection,
  type NewsletterSubscriber,
  type Customer,
  type DashboardStats,
  type SalesAnalytics,
} from "./shopbot.types";

interface ShopBotClientOptions {
  baseUrl?: string;
  token?: string;
  fetch?: typeof fetch;
}

export class ShopBotClient {
  private baseUrl: string;
  private token?: string;
  private fetch: typeof fetch;

  constructor(options: ShopBotClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.SHOPBOT_API || 'http://localhost:4100';
    this.token = options.token;
    this.fetch = options.fetch || ((input, init) => fetch(input, init));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }
    if (options.body) {
      headers.set("Content-Type", "application/json");
    }

    const response = await this.fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(response.status, message || response.statusText);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  // Generic methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Domain-specific methods
  auth = {
    login: (data: LoginRequest) =>
      this.post<LoginResponse>("/api/auth/login", data),
  };

  products = {
    list: () => this.get<Product[]>("/api/store/products"),
    get: (id: string) => this.get<Product>(`/api/store/products/${id}`),
    create: (data: Partial<Product>) =>
      this.post<Product>("/api/dashboard/products", data),
    update: (id: string, data: Partial<Product>) =>
      this.put<Product>(`/api/dashboard/products/${id}`, data),
    delete: (id: string) => this.delete(`/api/dashboard/products/${id}`),
  };

  orders = {
      list: () => this.get<Order[]>('/api/dashboard/orders'),
      get: (id: string) => this.get<Order>(`/api/dashboard/orders/${id}`),
  }

  categories = {
      list: () => this.get<Category[]>('/api/store/categories'),
  }

  cart = {
      update: (data: CartUpdateRequest) => this.post<CartUpdateResponse>('/api/cart', data),
  }

  store = {
    wipe: () => this.post("/api/dashboard/store/wipe", {}),
  };

  coupons = {
    list: () => this.get<Coupon[]>('/api/dashboard/coupons'),
    create: (data: Partial<Coupon>) => this.post<Coupon>('/api/dashboard/coupons', data),
    update: (id: string, data: Partial<Coupon>) => this.put<Coupon>(`/api/dashboard/coupons/${id}`, data),
    delete: (id: string) => this.delete(`/api/dashboard/coupons/${id}`),
  };

  shipping = {
    list: () => this.get<ShippingOption[]>('/api/dashboard/shipping'),
    create: (data: Partial<ShippingOption>) => this.post<ShippingOption>('/api/dashboard/shipping', data),
    update: (id: string, data: Partial<ShippingOption>) => this.put<ShippingOption>(`/api/dashboard/shipping/${id}`, data),
    delete: (id: string) => this.delete(`/api/dashboard/shipping/${id}`),
  };

  banners = {
    list: () => this.get<Banner[]>('/api/dashboard/banners'),
    create: (data: Partial<Banner>) => this.post<Banner>('/api/dashboard/banners', data),
    update: (id: string, data: Partial<Banner>) => this.put<Banner>(`/api/dashboard/banners/${id}`, data),
    delete: (id: string) => this.delete(`/api/dashboard/banners/${id}`),
  };

  gallery = {
    list: () => this.get<SwiperSlide[]>('/api/dashboard/gallery'),
    create: (data: Partial<SwiperSlide>) => this.post<SwiperSlide>('/api/dashboard/gallery', data),
    update: (id: string, data: Partial<SwiperSlide>) => this.put<SwiperSlide>(`/api/dashboard/gallery/${id}`, data),
    delete: (id: string) => this.delete(`/api/dashboard/gallery/${id}`),
  };

  websiteSections = {
    list: () => this.get<WebsiteSection[]>('/api/dashboard/website-sections'),
    update: (id: string, data: Partial<WebsiteSection>) => this.put<WebsiteSection>(`/api/dashboard/website-sections/${id}`, data),
  };

  newsletters = {
    list: () => this.get<NewsletterSubscriber[]>('/api/dashboard/subscribers'),
    add: (email: string) => this.post<NewsletterSubscriber>('/api/store/subscribe', { email }),
  };

  customers = {
    list: () => this.get<Customer[]>('/api/dashboard/customers'),
    get: (id: string) => this.get<Customer>(`/api/dashboard/customers/${id}`),
  };

  stats = {
    dashboard: () => this.get<DashboardStats>('/api/dashboard/stats'),
  };

  analytics = {
    sales: (period: string) => this.get<SalesAnalytics>(`/api/dashboard/analytics/sales?period=${period}`),
  };
}
