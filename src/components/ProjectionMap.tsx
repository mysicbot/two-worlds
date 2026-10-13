import { geoContains, geoPath } from "d3-geo";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { featureMatches, type CountryCollection, type CountryFeature } from "@/lib/geojson";
import { wheelZoomFactor, type GeoView } from "@/lib/geo-view";
import {
  applyView,
  createProjection,
  featureCentroid,
  invertPoint,
  makeGraticule,
  makeParallels,
  PROJECTION_META,
  projectPoint,
  sphericalAreaKm2,
  zoomViewAbout,
  type ProjectionId,
} from "@/lib/projections";
import { useAppStore, viewFor } from "@/lib/store";
import { tissotPolygons } from "@/lib/tissot";

type Props = {
  id: ProjectionId;
  collection: CountryCollection | null;
};

const GRATICULE = makeGraticule();
const INDICATRIX = tissotPolygons();

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
  const gesturingRef = useRef(false);
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

    const dpr = gesturingRef.current ? 1 : Math.min(window.devicePixelRatio || 1, 2);
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

    if (gesturingRef.current) {
      projection.precision(2.5);
      if (showGraticule) {
        ctx.beginPath();
        path(GRATICULE);
        ctx.strokeStyle = graticuleColor;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.beginPath();
      path(collection as never);
      ctx.fillStyle = land;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.lineWidth = 0.4;
      ctx.stroke();
      if (highlightedNames.length || highlightedContinents.length || picked) {
        for (const feature of collection.features) {
          const active = featureMatches(feature, highlightedNames, highlightedContinents, excludedNames);
          const isPick = Boolean(picked && picked.name === feature.properties.NAME);
          if (!active && !isPick) continue;
          ctx.beginPath();
          path(feature as never);
          ctx.fillStyle = landHi;
          ctx.fill();
        }
      }
      return;
    }

    if (showGraticule) {
      ctx.beginPath();
      path(GRATICULE);
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
      for (const poly of INDICATRIX) {
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
    const dpr = gesturingRef.current ? 1 : Math.min(window.devicePixelRatio || 1, 2);
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

  useLayoutEffect(() => {
    draw();
  }, [draw]);

  useLayoutEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      redrawRef.current();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const zoomApi = useRef({
    zoomBy: (_factor: number, _x: number, _y: number) => {},
    zoomFrom: (_base: GeoView, _factor: number, _x: number, _y: number) => {},
    setImmediate: (_view: GeoView) => {},
    end: () => {},
  });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; view: GeoView } | null>(null);
  const pinchedRef = useRef(false);
  const redrawRef = useRef(() => {});
  redrawRef.current = () => {
    draw();
    drawOverlay();
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let painted = viewRef.current;
    let target = painted;
    let anchorGeo: [number, number] | null = null;
    let dirty = false;
    let idle = 0;

    const maps = () => document.querySelectorAll<HTMLElement>("[data-world-map]");

    const clearPreview = () => {
      maps().forEach((el) => {
        el.style.transition = "none";
        el.style.transform = "";
        el.style.transformOrigin = "";
      });
    };

    const commit = (sharp: boolean) => {
      window.clearTimeout(idle);
      idle = 0;
      if (!dirty) {
        if (sharp && gesturingRef.current) {
          gesturingRef.current = false;
          redrawRef.current();
        }
        return;
      }
      clearPreview();
      gesturingRef.current = !sharp;
      setViewFor(id, target);
      painted = target;
      dirty = false;
      anchorGeo = null;
      if (sharp) gesturingRef.current = false;
    };

    const previewScale = () => {
      const scale = painted.lonSpan / target.lonSpan;
      maps().forEach((el) => {
        const mapId = el.dataset.worldMap as ProjectionId;
        const w = el.clientWidth;
        const h = el.clientHeight;
        const pt = anchorGeo ? projectPoint(mapId, painted, anchorGeo, w, h) : null;
        el.style.transition = "transform 60ms ease-out";
        el.style.transformOrigin = pt ? `${pt[0]}px ${pt[1]}px` : "50% 50%";
        el.style.transform = `scale(${scale})`;
      });
    };

    const previewPan = () => {
      let shift = 0;
      maps().forEach((el) => {
        const mapId = el.dataset.worldMap as ProjectionId;
        const w = el.clientWidth;
        const h = el.clientHeight;
        const pt = projectPoint(mapId, painted, target.center, w, h);
        const dx = pt ? w / 2 - pt[0] : 0;
        const dy = pt ? h / 2 - pt[1] : 0;
        if (mapId === id) shift = Math.hypot(dx, dy);
        el.style.transition = "none";
        el.style.transformOrigin = "0 0";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      return shift;
    };

    const armIdle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => commit(true), 80);
    };

    zoomApi.current = {
      zoomBy: (factor, x, y) => {
        if (!dirty) painted = viewRef.current;
        if (!anchorGeo) anchorGeo = invertPoint(id, painted, x, y, wrap.clientWidth, wrap.clientHeight);
        target = zoomViewAbout(id, dirty ? target : painted, factor, { x, y }, wrap.clientWidth, wrap.clientHeight);
        dirty = true;
        previewScale();
        const scale = painted.lonSpan / target.lonSpan;
        if (scale < 0.62 || scale > 1.62) commit(false);
        armIdle();
      },
      zoomFrom: (base, factor, x, y) => {
        window.clearTimeout(idle);
        if (!dirty) painted = base;
        if (!anchorGeo) anchorGeo = invertPoint(id, base, x, y, wrap.clientWidth, wrap.clientHeight);
        target = zoomViewAbout(id, base, factor, { x, y }, wrap.clientWidth, wrap.clientHeight);
        dirty = true;
        previewScale();
        const scale = base.lonSpan / target.lonSpan;
        if (scale < 0.58 || scale > 1.72) {
          commit(false);
          const pts = [...pointers.current.values()];
          if (pts.length >= 2) {
            pinchRef.current = {
              dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
              view: viewRef.current,
            };
          }
        }
      },
      setImmediate: (next) => {
        window.clearTimeout(idle);
        if (!dirty) painted = viewRef.current;
        target = next;
        dirty = true;
        anchorGeo = null;
        const shift = previewPan();
        if (shift > 150) commit(false);
      },
      end: () => {
        commit(true);
      },
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = wrap.getBoundingClientRect();
      zoomApi.current.zoomBy(wheelZoomFactor(e), e.clientX - rect.left, e.clientY - rect.top);
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrap.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
      clearPreview();
      gesturingRef.current = false;
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
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2) {
      dragRef.current = null;
      pinchedRef.current = true;
      const pts = [...pointers.current.values()];
      pinchRef.current = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        view: viewRef.current,
      };
      return;
    }
    pinchRef.current = null;
    dragRef.current = { x: e.clientX, y: e.clientY, view };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    const wrap = wrapRef.current;
    if (pointers.current.size >= 2 && pinchRef.current && wrap) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const rect = wrap.getBoundingClientRect();
      const x = (pts[0].x + pts[1].x) / 2 - rect.left;
      const y = (pts[0].y + pts[1].y) / 2 - rect.top;
      zoomApi.current.zoomFrom(pinchRef.current.view, pinchRef.current.dist / dist, x, y);
      return;
    }
    if (wrap && !dragRef.current) {
      setCursor(invertAt(id, view, wrap, e.clientX, e.clientY));
    }
    const drag = dragRef.current;
    if (!drag || !wrap) return;
    const start = invertAt(id, drag.view, wrap, drag.x, drag.y);
    const now = invertAt(id, drag.view, wrap, e.clientX, e.clientY);
    if (!start || !now) return;
    zoomApi.current.setImmediate({
      center: [drag.view.center[0] - (now[0] - start[0]), drag.view.center[1] - (now[1] - start[1])],
      lonSpan: drag.view.lonSpan,
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size >= 1) {
      pinchRef.current = null;
      dragRef.current = null;
      return;
    }
    pinchRef.current = null;
    const drag = dragRef.current;
    dragRef.current = null;
    const wasPinch = pinchedRef.current;
    pinchedRef.current = false;
    zoomApi.current.end();
    if (wasPinch || !drag) return;
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
      data-world-map={id}
      className="relative h-full min-h-[200px] w-full overflow-hidden overscroll-contain bg-ocean"
      onPointerLeave={() => setCursor(null)}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          dragRef.current = null;
          pinchRef.current = null;
          if (pointers.current.size === 0) {
            pinchedRef.current = false;
            zoomApi.current.end();
          }
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
