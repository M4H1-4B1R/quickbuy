import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { StorefrontChrome } from "@/components/storefront/storefront-chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Roadsters",
  description: "Premium clothes, trendy apparel, and everyday fashion essentials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}