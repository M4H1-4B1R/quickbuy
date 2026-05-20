import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { StorefrontChrome } from "@/components/storefront/storefront-chrome";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Storefront & Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
