"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/stores/catalog";

export function FeaturedCategories() {
  const allCategories = useCatalog((s) => s.categories);
  const categories = allCategories.filter((c) => c.featured);

  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink mb-8">
        Featured
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden bg-soft-cloud"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-3xl uppercase text-canvas leading-none mb-2">
                {cat.name}
              </h3>
              <span className="bg-canvas text-ink text-xs font-medium uppercase tracking-widest px-4 py-2">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}