import { geoPath } from "d3-geo";
import { useLayoutEffect, useRef } from "react";
import { WORLD_VIEW } from "@/lib/geo-view";
import type { CountryCollection } from "@/lib/geojson";
import { applyView, createProjection, makeGraticule, type ProjectionId } from "@/lib/projections";

const GRATICULE = makeGraticule(30);

function readToken(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

type Props = {
  id: ProjectionId;
  collection: CountryCollection | null;
};

/** A still picture of the world view. Not a live map. */
export function ProjectionThumb({ id, collection }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !collection) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, wrap.clientWidth);
    const height = Math.max(1, wrap.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = readToken("--color-ocean", "#0e1613");
    ctx.fillRect(0, 0, width, height);

    const projection = applyView(createProjection(id), WORLD_VIEW, width, height);
    projection.precision(1.4);
    const path = geoPath(projection, ctx);

    ctx.beginPath();
    path(GRATICULE);
    ctx.strokeStyle = readToken("--color-graticule", "#2f3d37");
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.beginPath();
    path(collection as never);
    ctx.fillStyle = readToken("--color-land", "#3d5a52");
    ctx.fill();
    ctx.strokeStyle = readToken("--color-border", "#2a342f");
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }, [collection, id]);

  return (
    <div ref={wrapRef} className="relative h-16 w-full overflow-hidden rounded-sm bg-ocean sm:h-[4.5rem]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
