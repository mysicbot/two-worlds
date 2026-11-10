import {
  geoArea,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoCentroid,
  geoCircle,
  geoConicConformal,
  geoConicEqualArea,
  geoEqualEarth,
  geoEquirectangular,
  geoGraticule,
  geoMercator,
  geoOrthographic,
  geoStereographic,
  type GeoPermissibleObjects,
  type GeoProjection,
} from "d3-geo";
import {
  geoCylindricalEqualArea,
  geoInterruptedHomolosine,
  geoMollweide,
  geoRobinson,
  geoSinusoidal,
  geoWinkel3,
} from "d3-geo-projection";
import type { ProjectionId } from "./catalog";
import { clampView, wrapLonDelta, type GeoView } from "./geo-view";

export type { ProjectionId } from "./catalog";
export { PROJECTION_META } from "./catalog";

const EARTH_RADIUS_KM = 6371;
const SPHERE = { type: "Sphere" } as GeoPermissibleObjects;
const projectionIds = new WeakMap<GeoProjection, ProjectionId>();
const fitSubjects = new WeakMap<GeoProjection, GeoPermissibleObjects>();
const fitCache = new Map<string, { scale: number; x: number; y: number }>();

const CONIC_CAP = geoCircle().center([0, 22]).radius(78).precision(2)();

export function createProjection(id: ProjectionId): GeoProjection {
  let projection: GeoProjection;
  switch (id) {
    case "mercator":
      projection = geoMercator();
      break;
    case "peters":
      projection = geoCylindricalEqualArea().parallel(45);
      break;
    case "homolosine":
      projection = geoInterruptedHomolosine();
      break;
    case "winkel":
      projection = geoWinkel3();
      break;
    case "equalEarth":
      projection = geoEqualEarth();
      break;
    case "plateCarree":
      projection = geoEquirectangular();
      break;
    case "orthographic":
      projection = geoOrthographic();
      break;
    case "azimuthalEquidistant":
      projection = geoAzimuthalEquidistant();
      break;
    case "stereographic":
      projection = geoStereographic().clipAngle(90);
      break;
    case "lambertAzimuthal":
      projection = geoAzimuthalEqualArea();
      break;
    case "albers":
      projection = geoConicEqualArea().parallels([29.5, 45.5]).rotate([-10, 0]);
      break;
    case "lambertConic":
      projection = geoConicConformal().parallels([30, 60]);
      fitSubjects.set(projection, CONIC_CAP);
      break;
    case "mollweide":
      projection = geoMollweide();
      break;
    case "sinusoidal":
      projection = geoSinusoidal();
      break;
    case "robinson":
      projection = geoRobinson();
      break;
  }
  projection.precision(0.3);
  projectionIds.set(projection, id);
  return projection;
}

export function applyView(
  projection: GeoProjection,
  view: GeoView,
  width: number,
  height: number,
): GeoProjection {
  const id = projectionIds.get(projection) ?? "mercator";
  const key = `${id}:${Math.round(width)}x${Math.round(height)}:v2`;
  let fit = fitCache.get(key);
  if (!fit) {
    const pad = 12;
    const right = Math.max(pad + 1, width - pad);
    const bottom = Math.max(pad + 1, height - pad);
    projection.fitExtent(
      [
        [pad, pad],
        [right, bottom],
      ],
      fitSubjects.get(projection) ?? SPHERE,
    );
    const [x, y] = projection.translate();
    fit = { scale: projection.scale(), x, y };
    fitCache.set(key, fit);
  }
  projection.scale(fit.scale);
  projection.translate([fit.x, fit.y]);
  projection.scale(fit.scale * (360 / view.lonSpan));
  const pt = projection(view.center);
  if (pt) {
    const [tx, ty] = projection.translate();
    projection.translate([tx + width / 2 - pt[0], ty + height / 2 - pt[1]]);
  }
  return projection;
}

function invertView(
  id: ProjectionId,
  view: GeoView,
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number] | null {
  const inv = applyView(createProjection(id), view, width, height).invert?.([x, y]);
  if (!inv || !Number.isFinite(inv[0]) || !Number.isFinite(inv[1])) return null;
  if (Math.abs(inv[1]) > 90) return null;
  return [inv[0], inv[1]];
}

export function invertPoint(
  id: ProjectionId,
  view: GeoView,
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number] | null {
  return invertView(id, view, x, y, width, height);
}

export function projectPoint(
  id: ProjectionId,
  view: GeoView,
  lonlat: [number, number],
  width: number,
  height: number,
): [number, number] | null {
  const pt = applyView(createProjection(id), view, width, height)(lonlat);
  if (!pt || !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) return null;
  return [pt[0], pt[1]];
}

/** Zoom `view` by `factor` (lonSpan multiplier) keeping the pixel `anchor` fixed. */
export function zoomViewAbout(
  id: ProjectionId,
  view: GeoView,
  factor: number,
  anchor: { x: number; y: number } | null,
  width: number,
  height: number,
): GeoView {
  let next = clampView({ center: view.center, lonSpan: view.lonSpan * factor });
  if (!anchor || width < 2 || height < 2) return next;
  const geo = invertView(id, view, anchor.x, anchor.y, width, height);
  if (!geo) return next;
  for (let i = 0; i < 2; i += 1) {
    const under = invertView(id, next, anchor.x, anchor.y, width, height);
    if (!under) break;
    next = clampView({
      center: [next.center[0] + wrapLonDelta(geo[0] - under[0]), next.center[1] + (geo[1] - under[1])],
      lonSpan: next.lonSpan,
    });
  }
  return next;
}

export function sphericalAreaKm2(feature: GeoPermissibleObjects): number {
  return Math.abs(geoArea(feature)) * EARTH_RADIUS_KM * EARTH_RADIUS_KM;
}

export function featureCentroid(feature: GeoPermissibleObjects): [number, number] {
  const c = geoCentroid(feature);
  return [c[0], c[1]];
}

export function makeGraticule(step = 15) {
  return geoGraticule().step([step, step]).extent([
    [-180, -80],
    [180, 80],
  ])();
}

export function makeParallels(latitudes: number[]) {
  return {
    type: "MultiLineString" as const,
    coordinates: latitudes.map((lat) =>
      Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat] as [number, number]),
    ),
  };
}
