import { useQuery } from "@tanstack/react-query";
import { Order } from "@/lib/types";

async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders?id=${id}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });
}
