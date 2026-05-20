"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatMoney } from "@/lib/utils";

function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 h-20 bg-hairline-soft animate-pulse rounded-none shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-hairline-soft animate-pulse rounded w-3/4" />
        <div className="h-3 bg-hairline-soft animate-pulse rounded w-1/2" />
        <div className="h-4 bg-hairline-soft animate-pulse rounded w-1/4" />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <Sheet open={false}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display uppercase">Your Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <CartDrawerInner />;
}

function CartDrawerInner() {
  const lines = useCart((s) => s.lines);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const subtotal = useCart.getState().subtotal;

  const total = subtotal();

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display uppercase">Your Cart</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-soft-cloud flex items-center justify-center">
              <svg
                className="w-8 h-8 text-mute"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-sm text-mute">Your cart is empty</p>
            <Button variant="outline" onClick={close} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-1">
              <div className="space-y-0">
                {lines.map((line, idx) => (
                  <div key={`${line.productId}-${line.size}-${line.color}`}>
                    <div className="flex gap-4 py-4">
                      <div className="shrink-0">
                        <Image
                          src={line.image}
                          alt={line.name}
                          width={80}
                          height={80}
                          className="object-cover w-20 h-20 bg-soft-cloud"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {line.name}
                        </p>
                        <p className="text-xs text-mute mt-0.5">
                          {line.size} / {line.color}
                        </p>
                        <p className="text-sm font-medium text-ink mt-1">
                          {formatMoney(line.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setQty(idx, line.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {line.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setQty(idx, line.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-mute hover:text-sale"
                            onClick={() => remove(idx)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {idx < lines.length - 1 && (
                      <Separator className="bg-hairline-soft" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t border-hairline-soft mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mute">Subtotal</span>
                <span className="text-base font-medium text-ink">
                  {formatMoney(total)}
                </span>
              </div>
              <p className="text-xs text-stone">
                Shipping calculated at checkout
              </p>
              <Button asChild className="w-full" onClick={close}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}