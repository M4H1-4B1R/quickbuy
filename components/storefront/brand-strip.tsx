export function BrandStrip() {
  const brands = ["STUDIO", "FORM", "CORE", "LIFE", "LAB", "WALK"];

  return (
    <div className="bg-soft-cloud py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {brands.map((name) => (
            <span
              key={name}
              className="font-display text-xl md:text-2xl uppercase tracking-widest text-charcoal opacity-60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}