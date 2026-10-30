const brandLogoSource = "/aiv2ray-logo-horizontal.png";

export function BrandCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`brand-card${compact ? " compact" : ""}`}
      role="img"
      aria-label="aiV2Ray shield and wordmark"
    >
      <img
        className="brand-card-logo"
        src={brandLogoSource}
        alt=""
        width={1611}
        height={265}
        decoding="async"
        fetchPriority={compact ? undefined : "high"}
        draggable={false}
      />
    </div>
  );
}
