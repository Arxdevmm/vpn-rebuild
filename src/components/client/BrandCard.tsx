import { Sparkles } from 'lucide-react';

export function BrandCard({ compact = false }: { compact?: boolean }) {
  return <div className={`brand-card${compact ? ' compact' : ''}`} aria-label="AIV2Ray">
    <span className="brand-card-icon"><Sparkles aria-hidden="true" /></span>
    <span className="brand-card-name">AIV2Ray</span>
  </div>;
}
