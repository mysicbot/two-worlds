import { useEffect, useState } from "react";
import { motionOk, useEase, useOnScreen } from "./hooks";

export function FlattenLab() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [lat, setLat] = useState(60);
  const [keep, setKeep] = useState<"angles" | "area">("angles");
  const [cut, setCut] = useState(false);
  const [play, setPlay] = useState(false);
  const peel = useEase(cut ? 1 : 0, 900);
  const k = 1 / Math.cos((Math.min(lat, 75) * Math.PI) / 180);
  const r = 28;
  const cap = Math.min(k, 3.2);
  const rx = keep === "angles" ? r * cap : r / Math.sqrt(cap);
  const ry = keep === "angles" ? r * cap : r * Math.sqrt(cap);

  useEffect(() => {
    if (!play || !visible || !motionOk()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = ((now - t0) / 5000) % 1;
      const tri = u < 0.5 ? u * 2 : (1 - u) * 2;
      setLat(Math.round(tri * 14) * 5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, visible]);

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <figcaption>
          <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">One true circle</p>
          <p className="mt-1 text-sm text-fg">On the globe this is a circle. On the page it has to change.</p>
        </figcaption>
        <button
          type="button"
          onClick={() => setPlay((v) => !v)}
          className="min-h-9 rounded-sm border border-border px-3 text-xs text-fg"
        >
          {play ? "Pause" : "Play"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setKeep("angles")}
          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm ${
            keep === "angles" ? "border-accent bg-bg text-fg" : "border-border text-muted"
          }`}
        >
          Keep the corners
          <span className="mt-0.5 block text-[11px] text-subtle">Mercator’s choice. The circle grows.</span>
        </button>
        <button
          type="button"
          onClick={() => setKeep("area")}
          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm ${
            keep === "area" ? "border-accent bg-bg text-fg" : "border-border text-muted"
          }`}
        >
          Keep the size
          <span className="mt-0.5 block text-[11px] text-subtle">The circle becomes an oval. The ink stays the same.</span>
        </button>
      </div>
      <svg viewBox="0 0 320 160" className="mt-2 h-auto w-full" role="img" aria-label="A circle on the globe and the same circle drawn on a flat map">
        <text x="70" y="22" textAnchor="middle" className="fill-subtle text-[11px]">
          on the globe
        </text>
        <circle cx="70" cy="92" r={r} fill="none" className="text-highlight" stroke="currentColor" strokeWidth="1.6" />
        <text x="220" y="22" textAnchor="middle" className="fill-subtle text-[11px]">
          on the page
        </text>
        <ellipse cx="220" cy="92" rx={rx} ry={ry} fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <label className="flex items-center gap-3 text-sm text-muted">
        <span className="w-16 shrink-0 font-mono text-xs tabular-nums">{lat}° N</span>
        <input
          type="range"
          min={0}
          max={70}
          step={5}
          value={lat}
          onChange={(e) => {
            setPlay(false);
            setLat(Number(e.target.value));
          }}
          className="h-1.5 w-full accent-accent"
          aria-label="How far north the circle is"
        />
      </label>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {lat === 0
          ? "On the equator the circle can stay a circle. The trouble starts as you go north or south."
          : keep === "angles"
            ? `At ${lat}° north, Mercator draws this circle about ${k.toFixed(1)} times wider. It covers about ${(k * k).toFixed(1)} times too much page. The corners stay square. The size does not.`
            : `At ${lat}° north, a size-honest map keeps the same amount of ink and lets the circle become an oval. The country is the right size. It may look bent.`}{" "}
        This is a sketch. The maps out front do it for real.
      </p>
      <button
        type="button"
        onClick={() => setCut((v) => !v)}
        className="mt-4 min-h-11 rounded-sm border border-border px-3 py-2 text-sm text-fg"
      >
        {cut ? "Put the peel back" : "Try to lay the peel flat"}
      </button>
      <svg viewBox="0 0 320 130" className="mt-2 h-auto w-full" aria-hidden>
        <circle cx="48" cy="64" r="28" className="fill-land" opacity={0.35 + (1 - peel) * 0.55} />
        {[0, 1, 2].map((i) => {
          const gap = (i - 1) * (6 + peel * 26);
          const lean = (i - 1) * peel * 10;
          return (
            <path
              key={i}
              d={`M${168 + gap - 16} 16 Q ${168 + gap + lean} 64 ${168 + gap - 10} 112 Q ${168 + gap} 82 ${168 + gap + 16} 16 Q ${168 + gap} 36 ${168 + gap - 16} 16 Z`}
              className="fill-land"
              opacity={0.55 + peel * 0.4}
            />
          );
        })}
      </svg>
      <p className="text-sm leading-relaxed text-muted">
        {cut
          ? "The gaps are the torn ocean. Goode’s map does this on purpose. It cuts the water so the continents can keep more of their shape."
          : "An orange peel will not lie down in one piece. You stretch it, or you cut it. Every world map does one of those two things."}
      </p>
    </figure>
  );
}
