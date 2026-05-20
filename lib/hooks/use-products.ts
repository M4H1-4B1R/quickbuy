import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/types";

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

async function fetchProduct(slug: string): Promise<Product> {
    const res = await fetch(`/api/products?slug=${slug}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  }
  
  export function useProduct(slug: string) {
    return useQuery({
      queryKey: ["product", slug],
      queryFn: () => fetchProduct(slug),
      enabled: !!slug,
    });
  }
