import { geoContains, geoPath } from "d3-geo";
import { useCallback, useEffect, useRef } from "react";
import { featureMatches, type CountryCollection, type CountryFeature } from "@/lib/geojson";
import { wheelZoomFactor, type GeoView } from "@/lib/geo-view";
import {
  applyView,
  createProjection,
  featureCentroid,
  makeGraticule,
  makeParallels,
  PROJECTION_META,
  sphericalAreaKm2,
  type ProjectionId,
} from "@/lib/projections";
import { useAppStore, viewFor } from "@/lib/store";
import { tissotCenters, tissotPolygon } from "@/lib/tissot";

type Props = {
  id: ProjectionId;
  collection: CountryCollection | null;
};

function readToken(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function invertAt(
  id: ProjectionId,
  view: GeoView,
  wrap: HTMLDivElement,
  clientX: number,
  clientY: number,
): [number, number] | null {
  const rect = wrap.getBoundingClientRect();
  const projection = applyView(createProjection(id), view, wrap.clientWidth, wrap.clientHeight);
  const inv = projection.invert?.([clientX - rect.left, clientY - rect.top]);
  if (!inv || !Number.isFinite(inv[0]) || !Number.isFinite(inv[1])) return null;
  if (Math.abs(inv[1]) > 90) return null;
  return inv;
}

export function ProjectionMap({ id, collection }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    view: GeoView;
  } | null>(null);
  const view = useAppStore((s) => viewFor(s, id));
  const viewRef = useRef(view);
  viewRef.current = view;
  const cursor = useAppStore((s) => s.cursor);
  const setViewFor = useAppStore((s) => s.setViewFor);
  const setCursor = useAppStore((s) => s.setCursor);
  const highlightedNames = useAppStore((s) => s.highlightedNames);
  const highlightedContinents = useAppStore((s) => s.highlightedContinents);
  const excludedNames = useAppStore((s) => s.excludedNames);
  const pickCountry = useAppStore((s) => s.pickCountry);
  const showGraticule = useAppStore((s) => s.showGraticule);
  const showTissot = useAppStore((s) => s.showTissot);
  const demoLat = useAppStore((s) => s.demoLat);
  const picked = useAppStore((s) => s.picked);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !collection) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, wrap.clientWidth);
    const height = Math.max(1, wrap.clientHeight);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const ocean = readToken("--color-ocean", "#0e1613");
    const land = readToken("--color-land", "#3d5a52");
    const landHi = readToken("--color-land-hi", "#c4b07a");
    const border = readToken("--color-border", "#2a342f");
    const graticuleColor = readToken("--color-graticule", "#2f3d37");
    const accent = readToken("--color-accent", "#8fa88a");
    const highlight = readToken("--color-highlight", "#d4c48a");
    const tissot = readToken("--color-tissot", "#d4c48a");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    const projection = applyView(createProjection(id), view, width, height);
    const path = geoPath(projection, ctx);
    const maxArea = width * height * 0.22;

    if (showGraticule) {
      ctx.beginPath();
      path(makeGraticule(15));
      ctx.strokeStyle = graticuleColor;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    if (demoLat !== null) {
      ctx.beginPath();
      path(makeParallels([demoLat, -demoLat].filter((lat, i, arr) => arr.indexOf(lat) === i)));
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const feature of collection.features) {
      const active = featureMatches(feature, highlightedNames, highlightedContinents, excludedNames);
      const isPick = Boolean(picked && picked.name === feature.properties.NAME);
      ctx.beginPath();
      path(feature as never);
      ctx.fillStyle = active || isPick ? landHi : land;
      ctx.globalAlpha = active || isPick ? 1 : 0.92;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = isPick ? highlight : border;
      ctx.lineWidth = isPick ? 1.6 : 0.45;
      ctx.stroke();
    }

    if (showTissot) {
      for (const center of tissotCenters()) {
        const poly = tissotPolygon(center);
        const area = Math.abs(path.area(poly));
        if (!Number.isFinite(area) || area < 8 || area > maxArea) continue;
        ctx.beginPath();
        path(poly);
        ctx.fillStyle = tissot;
        ctx.globalAlpha = 0.22;
        ctx.fill();
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = tissot;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    if (demoLat !== null) {
      const pt = projection([view.center[0], demoLat]);
      if (pt) {
        ctx.fillStyle = accent;
        ctx.font = "500 11px 'Source Sans 3', sans-serif";
        ctx.fillText(`${demoLat.toFixed(0)}°`, pt[0] + 6, pt[1] - 4);
      }
    }
  }, [
    collection,
    demoLat,
    excludedNames,
    highlightedContinents,
    highlightedNames,
    id,
    picked,
    showGraticule,
    showTissot,
    view,
  ]);

  const drawOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, wrap.clientWidth);
    const height = Math.max(1, wrap.clientHeight);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (!cursor) return;
    const projection = applyView(createProjection(id), view, width, height);
    const pt = projection(cursor);
    if (!pt) return;
    const [x, y] = pt;
    if (x < -20 || y < -20 || x > width + 20 || y > height + 20) return;
    const stroke = readToken("--color-highlight", "#d4c48a");
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.fillStyle = stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.globalAlpha = 0.45;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [cursor, id, view]);

  useEffect(() => {
    draw();
    drawOverlay();
  }, [draw, drawOverlay]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      draw();
      drawOverlay();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [draw, drawOverlay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let pending = 1;

    const flush = () => {
      raf = 0;
      const factor = pending;
      pending = 1;
      const current = viewRef.current;
      setViewFor(id, { center: current.center, lonSpan: current.lonSpan * factor });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pending *= wheelZoomFactor(e);
      if (!raf) raf = requestAnimationFrame(flush);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [id, setViewFor]);

  function hitFeature(clientX: number, clientY: number): CountryFeature | null {
    const wrap = wrapRef.current;
    if (!wrap || !collection) return null;
    const inv = invertAt(id, view, wrap, clientX, clientY);
    if (!inv) return null;
    for (let i = collection.features.length - 1; i >= 0; i -= 1) {
      const f = collection.features[i];
      if (geoContains(f as never, inv)) return f;
    }
    return null;
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, view };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const wrap = wrapRef.current;
    if (wrap) {
      setCursor(invertAt(id, view, wrap, e.clientX, e.clientY));
    }
    const drag = dragRef.current;
    if (!drag || !wrap) return;
    const start = invertAt(id, drag.view, wrap, drag.x, drag.y);
    const now = invertAt(id, drag.view, wrap, e.clientX, e.clientY);
    if (!start || !now) return;
    setViewFor(id, {
      center: [drag.view.center[0] - (now[0] - start[0]), drag.view.center[1] - (now[1] - start[1])],
      lonSpan: drag.view.lonSpan,
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
    if (moved > 6) return;
    const feature = hitFeature(e.clientX, e.clientY);
    if (!feature) {
      pickCountry(null);
      return;
    }
    const centroid = featureCentroid(feature as never);
    pickCountry({
      name: feature.properties.NAME,
      continent: feature.properties.CONTINENT,
      iso: feature.properties.ISO_A3,
      areaKm2: sphericalAreaKm2(feature as never),
      centroidLat: centroid[1],
    });
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-full min-h-[200px] w-full overflow-hidden bg-ocean"
      onPointerLeave={() => setCursor(null)}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
        aria-label={`${PROJECTION_META[id].title} world map`}
      />
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
