import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  sessionId: string;
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

const syncCartWithApi = (state: CartState) => {
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            store_slug: process.env.NEXT_PUBLIC_STORE_SLUG,
            session_id: state.sessionId,
            items: state.lines,
        }),
    }).catch(console.error);
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      sessionId: uuidv4(),
      add: (line) => {
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
        });
        syncCartWithApi(get());
    },
      remove: (idx) => {
        set((state) => ({ lines: state.lines.filter((_, i) => i !== idx) }));
        syncCartWithApi(get());
    },
      setQty: (idx, n) => {
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
        });
        syncCartWithApi(get());
    },
      clear: () => {
        set({ lines: [] });
        syncCartWithApi(get());
    },
      reset: () => {
        set({ lines: [], isOpen: false, sessionId: uuidv4() });
        syncCartWithApi(get());
    },
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
      partialize: (state) => ({ lines: state.lines, sessionId: state.sessionId }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.sessionId = state.sessionId || uuidv4();
        }
      }
    },
  ),
);
