import { useEffect, useState } from "react";
import { motionOk, useOnScreen } from "./hooks";

const SPAN = 0.85;

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  const s = p(a0);
  const e = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${s[0].toFixed(1)} ${s[1].toFixed(1)} A ${r} ${r} 0 ${large} 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
}

function Ring({
  cx,
  cy,
  r,
  progress,
  title,
  km,
}: {
  cx: number;
  cy: number;
  r: number;
  progress: number;
  title: string;
  km: string;
}) {
  const mid = Math.PI / 2;
  const a0 = mid - SPAN / 2;
  const a1 = mid + SPAN / 2;
  const a = a0 + (a1 - a0) * progress;
  const x0 = cx + Math.cos(a0) * r;
  const y0 = cy + Math.sin(a0) * r;
  const x1 = cx + Math.cos(a1) * r;
  const y1 = cy + Math.sin(a1) * r;
  const dx = cx + Math.cos(a) * r;
  const dy = cy + Math.sin(a) * r;

  return (
    <g>
      <text x={cx} y="22" textAnchor="middle" className="fill-fg text-[12px]">
        {title}
      </text>
      <text x={cx} y="38" textAnchor="middle" className="fill-subtle text-[10px]">
        {km}
      </text>
      <circle cx={cx} cy={cy} r={r} className="fill-land" />
      <circle cx={cx} cy={cy} r={r} fill="none" className="text-fg" stroke="currentColor" strokeWidth="1.6" />
      <path d={`${arc(cx, cy, r, a0, a1)} L ${cx} ${cy} Z`} className="fill-highlight" opacity="0.35" />
      <line x1={cx} y1={cy} x2={x0} y2={y0} className="text-muted" stroke="currentColor" strokeWidth="1.2" />
      <line x1={cx} y1={cy} x2={x1} y2={y1} className="text-muted" stroke="currentColor" strokeWidth="1.2" />
      <path d={arc(cx, cy, r, a0, a)} fill="none" className="text-highlight" stroke="currentColor" strokeWidth="3" />
      <circle cx={dx} cy={dy} r={Math.max(4.5, Math.min(6, r * 0.2))} className="fill-highlight" />
    </g>
  );
}

export function DegreeWalk() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible || !motionOk()) {
      if (!motionOk()) setProgress(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = ((now - t0) / 2800) % 1;
      setProgress(u);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const rEquator = 62;
  const rNorth = rEquator * Math.cos((70 * Math.PI) / 180);

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption>
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Same angle, different walk</p>
        <p className="mt-1 text-sm text-fg">Both dots cover one slice of the circle. They finish together. The walks are not the same length.</p>
      </figcaption>
      <svg viewBox="0 0 320 250" className="mt-2 h-auto w-full" role="img" aria-label="Two rings. The equator ring is wide. The far-north ring is small. The highlighted angle is the same.">
        <Ring cx={88} cy={140} r={rEquator} progress={progress} title="On the equator" km="one degree ≈ 111 km" />
        <g>
          <circle
            cx={242}
            cy={140}
            r={rEquator}
            fill="none"
            className="text-subtle"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </g>
        <Ring cx={242} cy={140} r={rNorth} progress={progress} title="At 70° north" km="one degree ≈ 38 km" />
      </svg>
      <p className="text-sm leading-relaxed text-muted">
        Look from above the pole. Each stripe of latitude is a ring. The dashed circle is the equator’s size, drawn
        again on the right so you can compare. The solid ring at 70° north is what’s left. Same angle. Shorter walk.
      </p>
    </figure>
  );
}
