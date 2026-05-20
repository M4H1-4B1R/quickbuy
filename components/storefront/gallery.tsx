"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  productName: string;
}

export function Gallery({ images, productName }: GalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-soft-cloud aspect-square flex items-center justify-center">
        <span className="text-mute text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="flex flex-col gap-2 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 bg-soft-cloud overflow-hidden border-2 transition-colors ${
                i === selected ? "border-ink" : "border-transparent hover:border-hairline"
              }`}
            >
              <Image src={img} alt={`${productName} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 bg-soft-cloud aspect-square overflow-hidden group">
        <Image
          src={images[selected]!}
          alt={productName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}