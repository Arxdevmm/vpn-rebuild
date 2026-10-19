export function Gauge({ label, value, unit, max, active }: { label: string; value: number; unit: string; max: number; active: boolean }) {
  const angle = -135 + Math.min(value / max, 1) * 270;
  return <div className={`instrument ${active ? 'instrument-active' : ''}`}>
    <svg className="gauge" viewBox="0 0 240 230" role="img" aria-label={`${label}: ${value} ${unit}`}>
      <circle cx="120" cy="112" r="99" className="gauge-rim" />
      <circle cx="120" cy="112" r="93" className="gauge-face" />
      <path d="M 59 173 A 86 86 0 1 1 181 173" className="gauge-track" />
      {Array.from({ length: 37 }, (_, i) => { const a = (135 + i * 7.5) * Math.PI / 180; const major = i % 6 === 0; const r3 = (v: number) => Math.round(v * 1000) / 1000; return <line key={i} x1={r3(120 + Math.cos(a) * (major ? 72 : 77))} y1={r3(112 + Math.sin(a) * (major ? 72 : 77))} x2={r3(120 + Math.cos(a) * 84)} y2={r3(112 + Math.sin(a) * 84)} className={major ? 'tick-major' : 'tick-minor'} />; })}
      {[0, 1, 2, 3, 4, 5, 6].map((n) => { const a = (135 + n * 45) * Math.PI / 180; return <text key={n} x={120 + Math.cos(a) * 61} y={116 + Math.sin(a) * 61} className="gauge-scale">{Math.round(max * n / 6)}</text>; })}
      <text x="120" y="77" className="gauge-brand">NETCON</text>
      <g transform={`rotate(${angle} 120 112)`} className="needle"><path d="M117 125 L120 35 L123 125 Z" className="needle-front" /><path d="M120 35 L123 125 L120 125 Z" className="needle-bevel" /></g>
      <circle cx="120" cy="112" r="9" className="needle-hub" /><circle cx="120" cy="112" r="4" className="needle-center" />
      <text x="120" y="153" className="gauge-value">{value === 0 ? '—' : value}</text><text x="120" y="171" className="gauge-unit">{unit}</text>
    </svg><div className="instrument-label">{label}</div>
  </div>;
}