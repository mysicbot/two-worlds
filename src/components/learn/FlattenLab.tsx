import { useState } from "react";

export function FlattenLab() {
  const [lat, setLat] = useState(60);
  const [keep, setKeep] = useState<"angles" | "area">("angles");
  const [cut, setCut] = useState(false);
  const k = 1 / Math.cos((Math.min(lat, 75) * Math.PI) / 180);
  const r = 28;
  const rx = keep === "angles" ? r * Math.min(k, 3.2) : r / Math.sqrt(Math.min(k, 3.2));
  const ry = keep === "angles" ? r * Math.min(k, 3.2) : r * Math.sqrt(Math.min(k, 3.2));

  return (
    <figure className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption>
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">One true circle</p>
        <p className="mt-1 text-sm text-fg">
          On the globe this is a circle. On the page it has to become something else.
        </p>
      </figcaption>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setKeep("angles")}
          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm ${
            keep === "angles" ? "border-accent bg-bg text-fg" : "border-border text-muted"
          }`}
        >
          Keep the angles
          <span className="mt-0.5 block text-[11px] text-subtle">Mercator’s choice. It grows.</span>
        </button>
        <button
          type="button"
          onClick={() => setKeep("area")}
          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm ${
            keep === "area" ? "border-accent bg-bg text-fg" : "border-border text-muted"
          }`}
        >
          Keep the area
          <span className="mt-0.5 block text-[11px] text-subtle">An equal-area choice. It stretches.</span>
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
          onChange={(e) => setLat(Number(e.target.value))}
          className="h-1.5 w-full accent-accent"
          aria-label="Latitude of the circle"
        />
      </label>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {lat === 0
          ? "On the equator the circle can stay a circle. Most of the argument starts when you leave it."
          : keep === "angles"
            ? `At ${lat}° north, Mercator draws this circle about ${k.toFixed(1)}× wider. Its area on the map is about ${(k * k).toFixed(1)}× the truth. The corners stay square. The size does not.`
            : `At ${lat}° north an equal-area map keeps the ink the same amount and lets the circle become an ellipse. The country is the right size. It may not look like itself.`}
        {" "}
        This is a sketch of the trade, not the full formula. The maps on the front page do it for real.
      </p>
      <button
        type="button"
        onClick={() => setCut((v) => !v)}
        className="mt-4 min-h-11 rounded-sm border border-border px-3 py-2 text-sm text-fg"
      >
        {cut ? "Put the peel back" : "Try to lay the peel flat"}
      </button>
      <svg viewBox="0 0 320 120" className="mt-2 h-auto w-full" aria-hidden>
        {[0, 1, 2].map((i) => {
          const gap = cut ? (i - 1) * 28 : (i - 1) * 4;
          const lean = cut ? (i - 1) * 8 : 0;
          return (
            <path
              key={i}
              d={`M${160 + gap - 16} 18 Q ${160 + gap + lean} 60 ${160 + gap - 10} 102 Q ${160 + gap} 78 ${160 + gap + 16} 18 Q ${160 + gap} 36 ${160 + gap - 16} 18 Z`}
              fill="none"
              className="text-land"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          );
        })}
      </svg>
      <p className="text-sm leading-relaxed text-muted">
        {cut
          ? "The gaps are the torn ocean. Goode’s homolosine makes that same choice: cut the water, and let the continents keep more of their shape."
          : "An orange peel does not lie down in one piece. You stretch it, or you cut it. Every world map is one of those two moves."}
      </p>
    </figure>
  );
}
