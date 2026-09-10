import {
  geoArea,
  geoCentroid,
  geoEqualEarth,
  geoGraticule,
  geoMercator,
  type GeoPermissibleObjects,
  type GeoProjection,
} from "d3-geo";
import { geoInterruptedHomolosine } from "d3-geo-projection";
import type { GeoView } from "./geo-view";

export type ProjectionId = "mercator" | "equalEarth" | "homolosine";

const EARTH_RADIUS_KM = 6371;
const SPHERE = { type: "Sphere" } as GeoPermissibleObjects;

export function createProjection(id: ProjectionId): GeoProjection {
  if (id === "mercator") return geoMercator().precision(0.3);
  if (id === "homolosine") return geoInterruptedHomolosine().precision(0.3);
  return geoEqualEarth().precision(0.3);
}

export function applyView(
  projection: GeoProjection,
  view: GeoView,
  width: number,
  height: number,
): GeoProjection {
  const pad = 12;
  const right = Math.max(pad + 1, width - pad);
  const bottom = Math.max(pad + 1, height - pad);
  projection.fitExtent(
    [
      [pad, pad],
      [right, bottom],
    ],
    SPHERE,
  );
  const worldScale = projection.scale();
  projection.scale(worldScale * (360 / view.lonSpan));
  const pt = projection(view.center);
  if (pt) {
    const [tx, ty] = projection.translate();
    projection.translate([tx + width / 2 - pt[0], ty + height / 2 - pt[1]]);
  }
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
  { title: string; subtitle: string; year: string; authors: string; tone: string }
> = {
  mercator: {
    title: "Mercator",
    subtitle: "Conformal · navigation",
    year: "1569",
    authors: "Gerardus Mercator",
    tone: "text-mercator",
  },
  equalEarth: {
    title: "Equal Earth",
    subtitle: "Equal-area · continuous",
    year: "2018",
    authors: "Šavrič, Patterson & Jenny",
    tone: "text-equal",
  },
  homolosine: {
    title: "Goode Homolosine",
    subtitle: "Equal-area · interrupted",
    year: "1923",
    authors: "John Paul Goode",
    tone: "text-highlight",
  },
};
