import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Coupon,
  ShippingOption,
  Banner,
  SwiperSlide,
  WebsiteSection,
  NewsletterSubscriber,
} from "@/lib/types";
import {
  seedCoupons,
  seedShipping,
  seedBanners,
  seedSwiper,
  seedWebsiteSections,
  seedSubscribers,
} from "@/lib/mock-data";

interface ContentState {
  coupons: Coupon[];
  shipping: ShippingOption[];
  banners: Banner[];
  swiper: SwiperSlide[];
  sections: WebsiteSection[];
  subscribers: NewsletterSubscriber[];

  addCoupon: (input: Omit<Coupon, "id">) => Coupon;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string) => Coupon | null;

  addShipping: (input: Omit<ShippingOption, "id">) => ShippingOption;
  updateShipping: (id: string, patch: Partial<ShippingOption>) => void;
  deleteShipping: (id: string) => void;

  addBanner: (input: Omit<Banner, "id">) => Banner;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addSwiperSlide: (input: Omit<SwiperSlide, "id">) => SwiperSlide;
  updateSwiperSlide: (id: string, patch: Partial<SwiperSlide>) => void;
  deleteSwiperSlide: (id: string) => void;

  addSection: (input: Omit<WebsiteSection, "id">) => WebsiteSection;
  updateSection: (id: string, patch: Partial<WebsiteSection>) => void;
  deleteSection: (id: string) => void;

  addSubscriber: (email: string) => NewsletterSubscriber;
  updateSubscriber: (
    id: string,
    patch: Partial<NewsletterSubscriber>,
  ) => void;
  deleteSubscriber: (id: string) => void;

  resetDemo: () => void;
}

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export const useContent = create<ContentState>()(
  persist(
    (set, get) => ({
      coupons: seedCoupons,
      shipping: seedShipping,
      banners: seedBanners,
      swiper: seedSwiper,
      sections: seedWebsiteSections,
      subscribers: seedSubscribers,

      addCoupon: (input) => {
        const c: Coupon = { ...input, id: crypto.randomUUID() };
        set((s) => ({ coupons: [...s.coupons, c] }));
        return c;
      },
      updateCoupon: (id, patch) =>
        set((s) => ({
          coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCoupon: (id) =>
        set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),
      validateCoupon: (code) => {
        const found = get().coupons.find(
          (c) => c.code.toLowerCase() === code.toLowerCase() && c.active,
        );
        return found ?? null;
      },

      addShipping: (input) => {
        const item: ShippingOption = { ...input, id: crypto.randomUUID() };
        set((s) => ({ shipping: [...s.shipping, item] }));
        return item;
      },
      updateShipping: (id, patch) =>
        set((s) => ({
          shipping: s.shipping.map((x) =>
            x.id === id ? { ...x, ...patch } : x,
          ),
        })),
      deleteShipping: (id) =>
        set((s) => ({ shipping: s.shipping.filter((x) => x.id !== id) })),

      addBanner: (input) => {
        const item: Banner = { ...input, id: crypto.randomUUID() };
        set((s) => ({ banners: [...s.banners, item] }));
        return item;
      },
      updateBanner: (id, patch) =>
        set((s) => ({
          banners: s.banners.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteBanner: (id) =>
        set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),

      addSwiperSlide: (input) => {
        const item: SwiperSlide = { ...input, id: crypto.randomUUID() };
        set((s) => ({ swiper: [...s.swiper, item] }));
        return item;
      },
      updateSwiperSlide: (id, patch) =>
        set((s) => ({
          swiper: s.swiper.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      deleteSwiperSlide: (id) =>
        set((s) => ({ swiper: s.swiper.filter((x) => x.id !== id) })),

      addSection: (input) => {
        const item: WebsiteSection = { ...input, id: crypto.randomUUID() };
        set((s) => ({ sections: [...s.sections, item] }));
        return item;
      },
      updateSection: (id, patch) =>
        set((s) => ({
          sections: s.sections.map((x) =>
            x.id === id ? { ...x, ...patch } : x,
          ),
        })),
      deleteSection: (id) =>
        set((s) => ({ sections: s.sections.filter((x) => x.id !== id) })),

      addSubscriber: (email) => {
        const item: NewsletterSubscriber = {
          id: crypto.randomUUID(),
          email,
          date: new Date().toISOString(),
        };
        set((s) => ({ subscribers: [...s.subscribers, item] }));
        return item;
      },
      updateSubscriber: (id, patch) =>
        set((s) => ({
          subscribers: s.subscribers.map((x) =>
            x.id === id ? { ...x, ...patch } : x,
          ),
        })),
      deleteSubscriber: (id) =>
        set((s) => ({
          subscribers: s.subscribers.filter((x) => x.id !== id),
        })),

      resetDemo: () =>
        set({
          coupons: seedCoupons,
          shipping: seedShipping,
          banners: seedBanners,
          swiper: seedSwiper,
          sections: seedWebsiteSections,
          subscribers: seedSubscribers,
        }),
    }),
    {
      name: "content",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
