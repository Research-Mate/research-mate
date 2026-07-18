interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-hidden="true">
      <span className="brand-mark__dot" />
      <span className="brand-mark__line brand-mark__line--one" />
      <span className="brand-mark__line brand-mark__line--two" />
      <span className="brand-mark__line brand-mark__line--three" />
    </span>
  );
}
