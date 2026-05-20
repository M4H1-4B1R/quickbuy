"use client";

import type { Variant } from "@/lib/types";

interface VariantPickerProps {
  variants: Variant[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function VariantPicker({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantPickerProps) {
const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const hasVariants = variants.length > 0;

  const getSizeAvailable = (size: string) => {
    return variants.some((v) => v.size === size && v.stock > 0);
  };

  const getColorAvailable = (color: string) => {
    return variants.some((v) => v.color === color && v.stock > 0);
  };

  return (
    <div className="space-y-4">
      {hasVariants && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Size</span>
              <span className="text-xs text-mute">{selectedSize || "Select"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const available = getSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={() => onSizeChange(size)}
                    disabled={!available}
                    className={`px-4 py-2 text-sm border rounded-sm min-w-12 transition-colors ${
                      selectedSize === size
                        ? "bg-ink text-canvas border-ink"
                        : available
                          ? "border-hairline-soft hover:border-ink bg-canvas"
                          : "border-hairline-soft text-mute line-through cursor-not-allowed bg-soft-cloud"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Color</span>
              <span className="text-xs text-mute">{selectedColor || "Select"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const available = getColorAvailable(color);
                return (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    disabled={!available}
                    title={color}
                    className={`relative w-7 h-7 rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-ink"
                        : "hover:ring-2 hover:ring-hairline-soft hover:ring-offset-1"
                    } ${!available ? "opacity-40 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color === "Default" ? "#999" : color }}
                  >
                    {!available && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-mute rotate-45 absolute" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}