import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/lib/shopbot.types";

async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/api/customers");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
}

async function fetchCustomer(id: string): Promise<Customer> {
  const res = await fetch(`/api/customers?id=${id}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });
}