import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: CartLine) => void;
  remove: (idx: number) => void;
  setQty: (idx: number, n: number) => void;
  clear: () => void;
  reset: () => void;
  open: () => void;
  close: () => void;
  count: () => number;
  subtotal: () => number;
}

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (line) =>
        set((state) => {
          const idx = state.lines.findIndex(
            (l) =>
              l.productId === line.productId &&
              l.size === line.size &&
              l.color === line.color,
          );
          if (idx >= 0) {
            const lines = state.lines.slice();
            const existing = lines[idx]!;
            lines[idx] = { ...existing, qty: existing.qty + line.qty };
            return { lines };
          }
          return { lines: [...state.lines, line] };
        }),
      remove: (idx) =>
        set((state) => ({ lines: state.lines.filter((_, i) => i !== idx) })),
      setQty: (idx, n) =>
        set((state) => {
          const target = state.lines[idx];
          if (!target) return state;
          const lines = state.lines.slice();
          if (n <= 0) {
            lines.splice(idx, 1);
          } else {
            lines[idx] = { ...target, qty: n };
          }
          return { lines };
        }),
      clear: () => set({ lines: [] }),
      reset: () => set({ lines: [], isOpen: false }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      count: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
