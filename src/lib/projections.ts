import {
  geoArea,
  geoCentroid,
  geoEqualEarth,
  geoGraticule,
  geoMercator,
  type GeoPermissibleObjects,
  type GeoProjection,
} from "d3-geo";
import type { GeoView } from "./geo-view";

export type ProjectionId = "mercator" | "equalEarth";

const EARTH_RADIUS_KM = 6371;

export function createProjection(id: ProjectionId): GeoProjection {
  if (id === "mercator") {
    return geoMercator().precision(0.3);
  }
  return geoEqualEarth().precision(0.3);
}

export function applyView(
  projection: GeoProjection,
  view: GeoView,
  width: number,
  height: number,
): GeoProjection {
  const pad = 12;
  projection.center(view.center).translate([width / 2, height / 2]).scale(1);

  const west: [number, number] = [view.center[0] - view.lonSpan / 2, view.center[1]];
  const east: [number, number] = [view.center[0] + view.lonSpan / 2, view.center[1]];
  const a = projection(west);
  const b = projection(east);
  const dx = a && b ? Math.abs(b[0] - a[0]) : 0;
  const target = Math.max(40, width - pad * 2);
  const scale = dx > 1e-6 ? target / dx : width / (2 * Math.PI);
  projection.scale(scale);
  return projection;
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

export const PROJECTION_META: Record<
  ProjectionId,
  { title: string; subtitle: string; year: string; authors: string }
> = {
  mercator: {
    title: "Mercator",
    subtitle: "Conformal · navigation",
    year: "1569",
    authors: "Gerardus Mercator",
  },
  equalEarth: {
    title: "Equal Earth",
    subtitle: "Equal-area · comparison",
    year: "2018",
    authors: "Šavrič, Patterson & Jenny",
  },
};
