"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/stores/content";
import type { Banner } from "@/lib/types";

export function HeroCarousel() {
  const banners = useContent((s) => [...s.banners].sort((a, b) => a.order - b.order));
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, banners.length]);

  if (!banners.length) return null;

  const slide = banners[current]!;

  return (
    <div className="relative bg-ink aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <Link href={slide.href} className="block w-full h-full relative">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16 max-w-xl">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase text-canvas leading-none tracking-tight mb-4">
              {slide.title}
            </h1>
            <span className="inline-block bg-canvas text-ink text-xs font-medium uppercase tracking-widest px-5 py-2.5">
              {slide.cta}
            </span>
          </div>
        </div>
      </Link>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-canvas/80 hover:bg-canvas text-ink w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-canvas/80 hover:bg-canvas text-ink w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-canvas" : "bg-canvas/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}