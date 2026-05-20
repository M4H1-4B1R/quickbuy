interface ProductGridProps {
  children: React.ReactNode;
  cols?: number;
  className?: string;
}

export function ProductGrid({ children, cols = 4, className = "" }: ProductGridProps) {
  const gridClass =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${gridClass} gap-2 md:gap-3 ${className}`}>
      {children}
    </div>
  );
}