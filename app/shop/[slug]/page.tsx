"use client";

import { useState, useMemo, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/lib/hooks/use-products";
import { useCart } from "@/stores/cart";
import { formatMoney } from "@/lib/utils";
import { Gallery } from "@/components/storefront/gallery";
import { VariantPicker } from "@/components/storefront/variant-picker";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ProductCard } from "@/components/storefront/product-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: products } = useProducts();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);

  const relatedProducts = useMemo(
    () =>
      product && products
        ? products
            .filter((p) => p.category === product.category && p.id !== product.id && p.status === "active")
            .slice(0, 4)
        : [],
    [products, product],
  );

  useEffect(() => {
    if (!product || selectedSize) return;
    const firstInStock = product.variants.find((v) => v.stock > 0);
    if (firstInStock) {
      setSelectedSize(firstInStock.size);
      setSelectedColor(firstInStock.color);
    }
  }, [product, selectedSize]);

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (error || !product) {
    notFound();
  }

  const variants = product.variants;

  const isAddDisabled = variants.length > 0 && (!selectedSize || !selectedColor);

  const getVariantStock = () => {
    if (!variants.length) return product.totalStock;
    return (
      variants.find((v) => v.size === selectedSize && v.color === selectedColor)?.stock ??
      0
    );
  };

  const handleAddToCart = () => {
    if (isAddDisabled) {
      toast.error("Please select size and color");
      return;
    }

    const stock = getVariantStock();
    if (stock < qty) {
      toast.error("Not enough stock available");
      return;
    }

    useCart.getState().add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      qty,
      size: selectedSize || "Default",
      color: selectedColor || "Default",
    });

    toast.success(`${product.name} added to cart`);
    useCart.getState().open();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-mute hover:text-ink mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div>
            <Gallery images={product.images} productName={product.name} />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-mute uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium text-ink">
                  {formatMoney(product.price)}
                </span>
                {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                  <span className="text-lg text-mute line-through">
                    {formatMoney(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-hairline-soft" />

            <VariantPicker
              variants={variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-hairline-soft rounded-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-soft-cloud transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-2 hover:bg-soft-cloud transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAddDisabled}
                className="flex-1"
                size="lg"
              >
                {isAddDisabled ? "Select Options" : "Add to Cart"}
              </Button>
            </div>

            {variants.length > 0 && (
              <p className="text-xs text-mute">
                Stock: {getVariantStock()} available
              </p>
            )}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-mute leading-relaxed">{product.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger>Details & Care</AccordionTrigger>
                <AccordionContent>
                  <ul className="text-sm text-mute space-y-1">
                    <li>Premium quality materials</li>
                    <li>Professional dry clean recommended</li>
                    <li>Keep away from direct sunlight</li>
                    {variants.length > 0 && (
                      <li>
                        Available sizes: {Array.from(new Set(variants.map((v) => v.size))).join(", ")}
                      </li>
                    )}
                    {variants.length > 0 && (
                      <li>
                        Available colors: {Array.from(new Set(variants.map((v) => v.color))).join(", ")}
                      </li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-mute space-y-2">
                    <p>Free standard shipping on orders over $150.</p>
                    <p>Express delivery available at checkout.</p>
                    <p>Returns accepted within 14 days of delivery.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-display text-2xl uppercase tracking-wide mb-6">
              You May Also Like
            </h2>
            <ProductGrid cols={4}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="bg-hairline-soft aspect-square animate-pulse rounded-sm" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-hairline-soft w-20 h-20 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-10 w-3/4 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-6 w-32 bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-px bg-hairline-soft" />
          <div className="h-12 w-full bg-hairline-soft animate-pulse rounded-sm" />
          <div className="h-12 w-full bg-hairline-soft animate-pulse rounded-sm" />
        </div>
      </div>
    </div>
  );
}