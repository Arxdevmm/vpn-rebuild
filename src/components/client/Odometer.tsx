import { useEffect, useRef, useState } from 'react';

// Mechanical drum counter: each digit is a wheel that rolls forward like an
// old car odometer / taxi meter. Wheels never roll backwards; when a wheel
// wraps 9 -> 0 it is silently re-seated and rolls on.
const COL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function Drum({ digit, accent }: { digit: number; accent?: boolean }) {
  const [pos, setPos] = useState(digit);
  const [instant, setInstant] = useState(true);
  const posRef = useRef(digit);

  useEffect(() => {
    const current = posRef.current % 10;
    const delta = (((digit - current) % 10) + 10) % 10;
    if (delta === 0) return;

    // Re-seat the wheel without animation when it would run off the strip.
    if (posRef.current + delta >= COL.length - 1) {
      posRef.current -= 10;
      setInstant(true);
      setPos(posRef.current);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setInstant(false);
        posRef.current += delta;
        setPos(posRef.current);
      }));
      return;
    }
    setInstant(false);
    posRef.current += delta;
    setPos(posRef.current);
  }, [digit]);

  return (
    <span className={`odo-drum${accent ? ' odo-accent' : ''}`}>
      <span
        className="odo-col"
        style={{ transform: `translateY(${-pos}em)`, transition: instant ? 'none' : undefined }}
      >
        {COL.map((d, i) => <span key={i}>{d}</span>)}
      </span>
    </span>
  );
}

export function Odometer({ value, decimals = 1, minIntegerDigits = 3, label }: { value: number; decimals?: number; minIntegerDigits?: number; label?: string }) {
  const text = value.toFixed(decimals).padStart(minIntegerDigits + decimals + (decimals > 0 ? 1 : 0), '0');
  const chars = text.split('');
  return (
    <span className="odometer" role="img" aria-label={label ? `${label}: ${text}` : text}>
      <span className="odo-window">
        {chars.map((c, i) => c === '.'
          ? <span key={i} className="odo-sep">·</span>
          : <Drum key={i} digit={Number(c)} accent={i === chars.length - 1} />)}
      </span>
    </span>
  );
}
