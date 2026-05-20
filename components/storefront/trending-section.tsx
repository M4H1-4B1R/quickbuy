"use client";

import Link from "next/link";
import { useProducts } from "@/lib/hooks/use-products";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";

export function TrendingSection() {
  const { data: allProducts = [] } = useProducts();
  const products = allProducts
    .filter((p) => p.status === "active")
    .slice(0, 8);

  if (!products.length) return null;

  return (
    <section className="bg-canvas py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
            Trending
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-charcoal hover:text-ink underline underline-offset-4 transition-colors"
          >
            View All
          </Link>
        </div>
        <ProductGrid cols={4}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </div>
    </section>
  );
}