import { useState } from "react";

const A_KM = 6378;
const B_KM = 6357;

function ring(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  bump: (angle: number) => number,
) {
  const pts: string[] = [];
  for (let i = 0; i <= 180; i += 1) {
    const a = (i / 180) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    const len = Math.hypot(x, y) || 1;
    const b = bump(a);
    pts.push(`${(cx + x + (x / len) * b).toFixed(1)},${(cy + y + (y / len) * b).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export function ShapeLab() {
  const [stretch, setStretch] = useState(1);
  const f = (1 / 298.257) * stretch;
  const rx = 86;
  const ry = 86 * (1 - f);
  const lump = Math.min(10, (stretch - 1) * 0.42);
  const peak = Math.min(16, (stretch - 1) * 0.7);
  const cx = 160;
  const cy = 118;

  return (
    <figure className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <figcaption>
          <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Look closer</p>
          <p className="mt-1 text-sm text-fg">Stretch the difference. The planet does not change. Your eye does.</p>
        </figcaption>
        <p className="font-mono text-xs text-muted tabular-nums">
          {stretch === 1 ? "true shape" : `${stretch}× the real flattening`}
        </p>
      </div>
      <svg viewBox="0 0 320 230" className="mt-2 h-auto w-full" role="img" aria-label="Side view of the Earth, from a smooth egg to the lumpy sea and the ground">
        <line x1="28" y1={cy} x2="292" y2={cy} stroke="currentColor" className="text-border" strokeDasharray="3 4" />
        <path d={ring(cx, cy, rx, ry, () => 0)} fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.6" />
        <path
          d={ring(cx, cy, rx, ry, (a) => lump * (Math.sin(a * 3) * 0.7 + Math.sin(a * 7 + 1) * 0.45))}
          fill="none"
          className="text-highlight"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d={ring(cx, cy, rx, ry, (a) => {
            const skin = lump * (Math.sin(a * 3) * 0.7 + Math.sin(a * 7 + 1) * 0.45);
            const everest = Math.exp(-(((a - 0.6) / 0.12) ** 2)) * peak;
            const andes = Math.exp(-(((a - 2.2) / 0.18) ** 2)) * peak * 0.7;
            const trench = -Math.exp(-(((a - 4.2) / 0.15) ** 2)) * peak * 0.85;
            return skin + everest + andes + trench;
          })}
          fill="none"
          className="text-fg"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <text x="292" y={cy - 6} textAnchor="end" className="fill-subtle text-[10px]">
          equator
        </text>
        <text x={cx} y="18" textAnchor="middle" className="fill-subtle text-[10px]">
          pole
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="text-accent">smooth egg</span>
        <span className="text-highlight">sea-level skin</span>
        <span className="text-fg">ground you stand on</span>
      </div>
      <label className="mt-4 flex items-center gap-3 text-sm text-muted">
        <span className="shrink-0">True</span>
        <input
          type="range"
          min={1}
          max={28}
          step={1}
          value={stretch}
          onChange={(e) => setStretch(Number(e.target.value))}
          className="h-1.5 w-full accent-accent"
          aria-label="Exaggerate the Earth's flattening"
        />
        <span className="shrink-0">Exaggerated</span>
      </label>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Centre to equator: {A_KM.toLocaleString("en-CA")} km. Centre to pole: {B_KM.toLocaleString("en-CA")} km.
        The gap is about 21 km. Mount Everest is under 9 km. On a globe the size of a beach ball, the whole
        squash is thinner than a coat of paint, which is why a ball is a fair first picture, and a bad last one.
      </p>
    </figure>
  );
}
