# Architecture

Two Worlds is a client-rendered educational WebGIS. There is no tile server,
no database in the product path, and no backend GIS engine. Projections are
computed in the browser with [d3-geo](https://github.com/d3/d3-geo).

## Stack

- React 19 + TanStack Start / Router
- Zustand for view, highlight, and UI state
- Canvas 2D for both maps (`ProjectionMap`)
- Natural Earth countries as static GeoJSON (`public/data/countries-110m.geojson`)

## Layout of the interesting code

| Path | Role |
| --- | --- |
| `src/lib/projections.ts` | `geoMercator` / `geoEqualEarth`, view fitting, spherical area |
| `src/lib/tissot.ts` | Lattice of geodesic circles (`geoCircle`, 3° radius) |
| `src/lib/geo-view.ts` | Shared geographic camera: centre + longitude span |
| `src/lib/geojson.ts` | Load + match Natural Earth features |
| `src/lib/regions.ts` | Distortion Explorer chips (Africa … Japan, Antarctica) |
| `src/lib/store.ts` | Sync mode, highlights, picked country, Tissot/graticule flags |
| `src/components/ProjectionMap.tsx` | Hit-testing, pan/zoom, land, graticule, Tissot |
| `src/components/DistortionExplorer.tsx` | Region chips + area-scale cards |
| `src/components/AreaCompare.tsx` | Country pick: geographic area vs sec²(φ) |
| `src/components/Education.tsx` | Short cartographic briefing in the page |

## Rendering

Each map is a `<canvas>` sized by a `ResizeObserver`. On every view or style
change the component:

1. Clears to ocean
2. Builds a d3 projection from the current `GeoView`
3. Strokes the 15° graticule (optional)
4. Fills country polygons; highlighted / picked features use the land-hi fill
5. If Tissot is on, fills and strokes each geodesic circle that survives clipping
6. Draws the parallel-slider overlay when a demo latitude is set

Hit-testing inverts the projection at the pointer and uses `d3.geoContains`.
A tap that did not drag selects a country; the view does not jump.

## What this is not

- Not Leaflet / MapLibre / OpenLayers. Those stacks hide the projection behind
  a Web Mercator tile plane. The whole point of this app is two *different*
  projections of the same lon/lat data.
- Not a measurement tool. 1:110m geometries and spherical area are for
  teaching relative size.
- Not an atlas. Explorer chips are a curated set, not every country.

See [CARTOGRAPHY.md](./CARTOGRAPHY.md) for the projection mathematics.
