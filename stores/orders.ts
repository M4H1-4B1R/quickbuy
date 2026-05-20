import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order, OrderStatus } from "@/lib/types";
import { seedOrders } from "@/lib/mock-data";

type OrderInput = Omit<Order, "id">;

interface OrdersState {
  orders: Order[];
  createOrder: (input: OrderInput) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
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

function nextOrderId(orders: Order[]): string {
  const numericIds = orders
    .map((o) => parseInt(o.id.replace(/^#/, ""), 10))
    .filter((n) => !Number.isNaN(n));
  if (numericIds.length === 0) return `#${orders.length + 1}`;
  return `#${Math.max(...numericIds) + 1}`;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      createOrder: (input) => {
        const id = nextOrderId(get().orders);
        const order: Order = { ...input, id };
        set((state) => ({ orders: [...state.orders, order] }));
        return order;
      },
      setStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        })),
      resetDemo: () => set({ orders: seedOrders }),
    }),
    {
      name: "orders",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
