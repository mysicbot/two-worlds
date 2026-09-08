export type LonLat = [number, number];

export type GeoView = {
  center: LonLat;
  lonSpan: number;
};

export const WORLD_VIEW: GeoView = {
  center: [10, 8],
  lonSpan: 360,
};

export function clampView(view: GeoView): GeoView {
  const lon = ((((view.center[0] + 180) % 360) + 360) % 360) - 180;
  const lat = Math.max(-78, Math.min(78, view.center[1]));
  const lonSpan = Math.max(18, Math.min(360, view.lonSpan));
  return { center: [lon, lat], lonSpan };
}
