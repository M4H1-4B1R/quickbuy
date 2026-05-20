import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShippingOption } from "@/lib/shopbot.types";

async function fetchShipping(): Promise<ShippingOption[]> {
  const res = await fetch("/api/shipping");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useShipping() {
  return useQuery({
    queryKey: ["shipping"],
    queryFn: fetchShipping,
  });
}

export function useCreateShipping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ShippingOption>) =>
      fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping"] });
    },
  });
}

export function useUpdateShipping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShippingOption> }) =>
      fetch(`/api/shipping/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping"] });
    },
  });
}

export function useDeleteShipping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/shipping/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping"] });
    },
  });
}