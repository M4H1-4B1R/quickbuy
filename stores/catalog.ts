import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, Category } from "@/lib/types";
import { seedProducts, seedCategories } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";

type ProductInput = Omit<
  Product,
  "id" | "slug" | "totalStock" | "createdAt" | "videos"
> & { videos?: string[] };

interface CatalogState {
  products: Product[];
  categories: Category[];
  addProduct: (input: ProductInput) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | undefined;
  bulkDelete: (ids: string[]) => void;
  bulkArchive: (ids: string[]) => void;
  addCategory: (input: Omit<Category, "id">) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
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

function buildProduct(input: ProductInput): Product {
  const totalStock = (input.variants ?? []).reduce(
    (sum, v) => sum + (v.stock ?? 0),
    0,
  );
  return {
    ...input,
    videos: input.videos ?? [],
    id: crypto.randomUUID(),
    slug: slugify(input.name),
    totalStock,
    createdAt: new Date().toISOString(),
  };
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: seedCategories,
      addProduct: (input) => {
        const product = buildProduct(input);
        set((state) => ({ products: [...state.products, product] }));
        return product;
      },
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      duplicateProduct: (id) => {
        const original = get().products.find((p) => p.id === id);
        if (!original) return undefined;
        const copy: Product = {
          ...original,
          id: crypto.randomUUID(),
          slug: `${original.slug}-copy`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, copy] }));
        return copy;
      },
      bulkDelete: (ids) =>
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id)),
        })),
      bulkArchive: (ids) =>
        set((state) => ({
          products: state.products.map((p) =>
            ids.includes(p.id) ? { ...p, status: "archived" } : p,
          ),
        })),
      addCategory: (input) => {
        const category: Category = { ...input, id: crypto.randomUUID() };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },
      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      resetDemo: () =>
        set({ products: seedProducts, categories: seedCategories }),
    }),
    {
      name: "catalog",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
