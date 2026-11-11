import { geoAzimuthalEqualArea, geoCentroid, geoPath } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import type { CountryCollection, CountryFeature } from "@/lib/geojson";
import { motionOk, useOnScreen } from "./hooks";

const GROW = 1 / Math.cos((72 * Math.PI) / 180);

type Drawn = { d: string; cx: number; cy: number; w: number };

function measure(input: CountryCollection | CountryFeature, scale: number): Drawn | null {
  const c = geoCentroid(input as never);
  if (!Number.isFinite(c[0]) || !Number.isFinite(c[1])) return null;
  const projection = geoAzimuthalEqualArea().rotate([-c[0], -c[1]]).scale(scale).translate([0, 0]).precision(0.4);
  const path = geoPath(projection);
  const d = path(input as never);
  if (!d) return null;
  const b = path.bounds(input as never);
  return {
    d,
    cx: (b[0][0] + b[1][0]) / 2,
    cy: (b[0][1] + b[1][1]) / 2,
    w: Math.max(1, b[1][0] - b[0][0]),
  };
}

type Props = { collection: CountryCollection | null };

export function SizeLie({ collection }: Props) {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [auto, setAuto] = useState(0);
  const [held, setHeld] = useState(0);
  const [user, setUser] = useState(false);
  const t = user ? held : auto;

  const art = useMemo(() => {
    if (!collection) return null;
    const africa: CountryCollection = {
      type: "FeatureCollection",
      features: collection.features.filter((f) => f.properties.CONTINENT === "Africa"),
    };
    const greenland = collection.features.find((f) => f.properties.NAME === "Greenland");
    if (!africa.features.length || !greenland) return null;
    const trial = measure(africa, 100);
    if (!trial) return null;
    const scale = 100 * (132 / trial.w);
    const a = measure(africa, scale);
    const g = measure(greenland, scale);
    if (!a || !g) return null;
    return { a, g };
  }, [collection]);

  useEffect(() => {
    if (user || !visible || !art || !motionOk()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = ((now - t0) / 6400) % 1;
      const tri = u < 0.5 ? u * 2 : (1 - u) * 2;
      setAuto(tri);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [user, visible, art]);

  const grow = 1 + t * (GROW - 1);

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption>
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">The famous mix-up</p>
        <p className="mt-1 text-sm text-fg">
          {t < 0.35
            ? "True size. Greenland fits into Africa about 14 times."
            : "A phone map stretches the north. Greenland is drawn about 10 times too big."}
        </p>
      </figcaption>
      <svg viewBox="0 0 360 260" className="mt-2 h-auto w-full" role="img" aria-label="Africa and Greenland at true size, then with Greenland stretched the way a phone map stretches it">
        {art ? (
          <>
            <g transform={`translate(100 108) translate(${-art.a.cx} ${-art.a.cy})`}>
              <path d={art.a.d} className="fill-land" />
            </g>
            <g transform={`translate(268 128) scale(${grow}) translate(${-art.g.cx} ${-art.g.cy})`}>
              <path d={art.g.d} className="fill-highlight" />
            </g>
          </>
        ) : (
          <text x="180" y="120" textAnchor="middle" className="fill-subtle text-[12px]">
            Loading the countries…
          </text>
        )}
        <text x="100" y="246" textAnchor="middle" className="fill-muted text-[11px]">
          Africa
        </text>
        <text x="268" y="246" textAnchor="middle" className="fill-highlight text-[11px]">
          Greenland
        </text>
      </svg>
      <label className="flex items-center gap-3 text-sm text-muted">
        <span className="shrink-0">True size</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(t * 100)}
          onChange={(e) => {
            setUser(true);
            setHeld(Number(e.target.value) / 100);
          }}
          className="h-1.5 w-full accent-accent"
          aria-label="From true size to a phone map"
        />
        <span className="shrink-0">Phone map</span>
      </label>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Africa is about 30 million square kilometres. Greenland is about 2 million. On the map app, places far north
        are stretched so the picture can be cut into square tiles. The countries did not change. The drawing did.
      </p>
    </figure>
  );
}
