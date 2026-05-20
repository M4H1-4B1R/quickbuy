"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { Toaster } from "@/components/ui/sonner";

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </>
  );
}
