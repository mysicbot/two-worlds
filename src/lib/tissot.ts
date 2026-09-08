import { geoCircle, type GeoPermissibleObjects } from "d3-geo";

/** Geodesic radius of each indicatrix, in degrees (~330 km). */
export const TISSOT_RADIUS_DEG = 3;

const LONS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
const LATS = [-60, -30, 0, 30, 60, 75];

export function tissotCenters(): [number, number][] {
  const pts: [number, number][] = [];
  for (const lat of LATS) {
    for (const lon of LONS) pts.push([lon, lat]);
  }
  return pts;
}

const circle = geoCircle().radius(TISSOT_RADIUS_DEG).precision(8);

export function tissotPolygon(center: [number, number]): GeoPermissibleObjects {
  return circle.center(center)();
}
