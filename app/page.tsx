import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
      <h1 className="font-display text-6xl md:text-8xl uppercase text-ink leading-none">
        Roadsters
      </h1>
      <p className="text-lg text-charcoal max-w-md">
        Curated lifestyle & fashion. Premium quality, timeless style.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/shop">Shop Now</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    </div>
  );
}