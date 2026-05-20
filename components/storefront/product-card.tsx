"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addToCart = useCart.getState().add;
 
   const image = product.images[0];
 
   const handleQuickAdd = (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();

    const firstInStockVariant =
      product.variants.find((v) => v.stock > 0) ??
      product.variants[0];

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: image ?? "",
      price: product.price,
      qty: 1,
      size: firstInStockVariant?.size ?? "M",
      color: firstInStockVariant?.color ?? "Default",
    });

    toast.success(`${product.name} added to cart`);
    useCart.getState().open();
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-soft-cloud aspect-square relative overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-hairline-soft" />
        )}

        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full shadow-sm whitespace-nowrap text-xs"
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        </div>
      </div>

      <div className="pt-3 pb-4 px-0.5">
        <p className="text-xs text-mute uppercase tracking-wide mb-0.5">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-ink mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">
            {formatMoney(product.price)}
          </span>
          {product.compareAtPrice != null && product.compareAtPrice > product.price && (
            <span className="text-xs text-mute line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}