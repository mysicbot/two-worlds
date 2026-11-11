import { useEffect, useState } from "react";
import { motionOk, useOnScreen } from "./hooks";

export function SpinLab() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [spin, setSpin] = useState(0);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (!play || !visible || !motionOk()) {
      if (!motionOk()) setSpin(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = ((now - t0) / 4200) % 1;
      const tri = u < 0.55 ? u / 0.55 : (1 - u) / 0.45;
      setSpin(Math.max(0, Math.min(1, tri)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, visible]);

  const rx = 50 * (1 + 0.1 * spin);
  const ry = 50 * (1 - 0.2 * spin);

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <figcaption>
          <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Watch it spin</p>
          <p className="mt-1 text-sm text-fg">Spin pushes the middle out. The drawing is much too strong, so you can see it.</p>
        </figcaption>
        <button
          type="button"
          onClick={() => setPlay((v) => !v)}
          className="min-h-9 rounded-sm border border-border px-3 text-xs text-fg"
        >
          {play ? "Pause" : "Play"}
        </button>
      </div>
      <svg viewBox="0 0 320 168" className="mt-2 h-auto w-full" role="img" aria-label="A round ball beside a spinning Earth that is wider at the middle">
        <text x="78" y="20" textAnchor="middle" className="fill-subtle text-[11px]">
          if it did not spin
        </text>
        <circle cx="78" cy="96" r="50" fill="none" className="text-subtle" stroke="currentColor" strokeWidth="1.4" />
        <line x1="28" y1="96" x2="128" y2="96" className="text-border" stroke="currentColor" strokeDasharray="3 4" />
        <text x="230" y="20" textAnchor="middle" className="fill-subtle text-[11px]">
          it spins
        </text>
        <ellipse cx="230" cy="96" rx={rx} ry={ry} fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.8" />
        <line x1={230 - rx} y1="96" x2={230 + rx} y2="96" className="text-accent" stroke="currentColor" strokeDasharray="3 4" />
        {([0, 1, 2, 3] as const).map((i) => {
          const a = spin * Math.PI * 2 + (i * Math.PI) / 2;
          const x = 230 + Math.cos(a) * (rx - 1);
          return <circle key={i} cx={x} cy="96" r="2.4" className="fill-highlight" />;
        })}
        <text x="230" y={96 - ry - 8} textAnchor="middle" className="fill-subtle text-[10px]">
          pole
        </text>
      </svg>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The real squash is about 21 km on a ride of 6,378 km. From space you would still say “ball.” The right-hand
        picture is a cartoon of the idea, not a portrait.
      </p>
    </figure>
  );
}
