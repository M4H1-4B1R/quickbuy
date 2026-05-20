import { useQuery } from "@tanstack/react-query";
import { Order } from "@/lib/types";

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}
