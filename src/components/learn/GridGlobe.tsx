import { geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useRef, useState } from "react";
import type { CountryCollection } from "@/lib/geojson";

type City = {
  name: string;
  lat: number;
  lon: number;
  line: string;
};

const CITIES: City[] = [
  {
    name: "Toronto",
    lat: 43.7,
    lon: -79.4,
    line: "About halfway from the equator to the north pole. And west of the line through London.",
  },
  {
    name: "Greenwich",
    lat: 51.5,
    lon: 0,
    line: "This is the zero line. People voted for it in 1884. The Earth has no seam here.",
  },
  {
    name: "Quito",
    lat: -0.2,
    lon: -78.5,
    line: "Almost on the equator. Latitude near zero.",
  },
  {
    name: "Nairobi",
    lat: -1.3,
    lon: 36.8,
    line: "The same belt as Quito, on the east side of the zero line.",
  },
  {
    name: "Sydney",
    lat: -33.9,
    lon: 151.2,
    line: "South of the equator, and far to the east.",
  },
  {
    name: "Reykjavík",
    lat: 64.1,
    lon: -21.9,
    line: "Far north. A step east or west is a much shorter walk up here.",
  },
];

const SPHERE = { type: "Sphere" } as GeoPermissibleObjects;

function line(lon: number | null, lat: number | null) {
  if (lat === 0) {
    return {
      type: "LineString" as const,
      coordinates: Array.from({ length: 73 }, (_, i) => [-180 + i * 5, 0] as [number, number]),
    };
  }
  return {
    type: "LineString" as const,
    coordinates: Array.from({ length: 37 }, (_, i) => [0, -90 + i * 5] as [number, number]),
  };
}

function graticule() {
  const coords: [number, number][][] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    coords.push(Array.from({ length: 37 }, (_, i) => [lon, -90 + i * 5] as [number, number]));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    coords.push(Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat] as [number, number]));
  }
  return { type: "MultiLineString" as const, coordinates: coords };
}

const GRID = graticule();
const EQUATOR = line(null, 0);
const MERIDIAN = line(0, null);

function token(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function kmPerDegree(lat: number) {
  return Math.round(111.3 * Math.cos((lat * Math.PI) / 180));
}

type Props = { collection: CountryCollection | null };

export function GridGlobe({ collection }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rot = useRef({ lambda: 20, phi: -18 });
  const target = useRef<{ lambda: number; phi: number } | null>(null);
  const drag = useRef<{ x: number; y: number; lambda: number; phi: number } | null>(null);
  const spinning = useRef(true);
  const [city, setCity] = useState<City>(CITIES[0]);
  const cityRef = useRef(city);
  cityRef.current = city;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) spinning.current = false;
    let frame = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, wrap.clientWidth);
      const height = Math.max(1, wrap.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (target.current && !drag.current) {
        rot.current.lambda += (target.current.lambda - rot.current.lambda) * 0.08;
        rot.current.phi += (target.current.phi - rot.current.phi) * 0.08;
        const done =
          Math.abs(target.current.lambda - rot.current.lambda) < 0.2 &&
          Math.abs(target.current.phi - rot.current.phi) < 0.2;
        if (done) target.current = null;
      } else if (spinning.current && !drag.current) {
        rot.current.lambda += 0.15;
      }

      const projection = geoOrthographic()
        .rotate([rot.current.lambda, rot.current.phi])
        .precision(1.2)
        .fitExtent(
          [
            [10, 10],
            [width - 10, height - 10],
          ],
          SPHERE,
        );
      const path = geoPath(projection, ctx);

      ctx.beginPath();
      path(SPHERE);
      ctx.fillStyle = token("--color-ocean", "#0e1613");
      ctx.fill();
      ctx.strokeStyle = token("--color-border", "#2a342f");
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      path(GRID);
      ctx.strokeStyle = token("--color-graticule", "#2f3d37");
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (collection) {
        ctx.beginPath();
        path(collection as never);
        ctx.fillStyle = token("--color-land", "#3d5a52");
        ctx.fill();
      }

      ctx.beginPath();
      path(EQUATOR);
      ctx.strokeStyle = token("--color-accent", "#8fa88a");
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      path(MERIDIAN);
      ctx.strokeStyle = token("--color-highlight", "#d4c48a");
      ctx.lineWidth = 1.6;
      ctx.stroke();

      const spot = projection([cityRef.current.lon, cityRef.current.lat]);
      if (spot) {
        ctx.beginPath();
        ctx.arc(spot[0], spot[1], 4.5, 0, Math.PI * 2);
        ctx.fillStyle = token("--color-highlight", "#d4c48a");
        ctx.fill();
        ctx.strokeStyle = token("--color-bg", "#0b100e");
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const tick = () => {
      draw();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [collection]);

  function focus(next: City) {
    setCity(next);
    spinning.current = false;
    let lambda = -next.lon;
    const current = rot.current.lambda;
    while (lambda - current > 180) lambda -= 360;
    while (current - lambda > 180) lambda += 360;
    target.current = { lambda, phi: -next.lat };
  }

  return (
    <figure className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Turn the globe</p>
        <p className="text-[11px] text-subtle">Sage line: the equator. Gold line: longitude zero.</p>
      </figcaption>
      <div
        ref={wrapRef}
        className="relative mt-3 h-64 w-full sm:h-80"
        onPointerDown={(e) => {
          spinning.current = false;
          target.current = null;
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            lambda: rot.current.lambda,
            phi: rot.current.phi,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          rot.current.lambda = d.lambda + (e.clientX - d.x) * 0.45;
          rot.current.phi = Math.max(-70, Math.min(70, d.phi + (d.y - e.clientY) * 0.35));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full touch-none" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CITIES.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => focus(item)}
            className={`min-h-9 rounded-sm border px-2.5 py-1 text-xs ${
              city.name === item.name ? "border-accent bg-bg text-fg" : "border-border text-muted hover:text-fg"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fg">{city.line}</p>
      <p className="mt-1 font-mono text-xs text-muted">
        {Math.abs(city.lat).toFixed(1)}°{city.lat >= 0 ? "N" : "S"} · {Math.abs(city.lon).toFixed(1)}°
        {city.lon >= 0 ? "E" : "W"}
        <span className="text-subtle">
          {" "}
          · one degree east or west here is about {kmPerDegree(city.lat)} km
          {Math.abs(city.lat) > 50 ? ". On the equator that same degree is 111 km." : ""}
        </span>
      </p>
    </figure>
  );
}
