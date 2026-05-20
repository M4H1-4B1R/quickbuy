"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const hydrated = useHydrated();
  const count = hydrated ? useCart.getState().count() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-canvas border-b border-hairline-soft h-14 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-xl uppercase tracking-wide text-ink shrink-0"
          >
            Roadsters
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-charcoal hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => useCart.getState().open()}
              aria-label="Cart"
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {count > 99 ? "99+" : count}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="font-display uppercase text-lg mt-2">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-charcoal hover:text-ink transition-colors py-3 px-2 border-b border-hairline-soft"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="sticky top-14 z-30 bg-canvas border-b border-hairline-soft px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 h-10 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <Button type="submit" variant="default" size="sm">
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}