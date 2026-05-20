import { HeroCarousel } from "@/components/storefront/hero-carousel";
import { BrandStrip } from "@/components/storefront/brand-strip";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { TrendingSection } from "@/components/storefront/trending-section";
import { Newsletter } from "@/components/storefront/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BrandStrip />
      <FeaturedCategories />
      <TrendingSection />
      <Newsletter />
    </>
  );
}