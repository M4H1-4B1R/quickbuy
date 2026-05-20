"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContent } from "@/stores/content";

export function Footer() {
  const [email, setEmail] = useState("");
  const addSubscriber = useContent((s) => s.addSubscriber);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    addSubscriber(trimmed);
    setEmail("");
    toast.success("You're subscribed! Welcome to the list.");
  };

  return (
    <footer className="bg-ink text-canvas">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl uppercase tracking-wide"
            >
              Roadsters
            </Link>
            <p className="mt-4 text-sm text-stone leading-relaxed">
              Curated lifestyle & fashion. Premium quality, timeless style.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-stone">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=newest"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?inStock=true"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  In Stock
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-stone">
              Info
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-canvas/80 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-stone">
              Newsletter
            </h3>
            <p className="text-sm text-stone mb-4">
              Get updates on new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-ink border-hairline text-canvas placeholder:text-stone focus:border-stone text-sm h-10"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="shrink-0 text-ink"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone">
            &copy; {new Date().getFullYear()} Roadsters. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-stone">Visa</span>
            <span className="text-xs text-stone">Mastercard</span>
            <span className="text-xs text-stone">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}