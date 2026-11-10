# Cartography notes

This document is the technical companion to the app. It is written for GIS
analysts and students, not as a substitute for Snyder or Bugayevskiy.

## The problem the maps share

A projection is a function from geographic coordinates (longitude λ, latitude φ
on a reference ellipsoid or sphere) to a plane (x, y). No such function can
preserve area, local shape, distance, and direction everywhere at once
(Gauss’s *Theorema Egregium*). Every world map therefore states a preference.

This app holds **one geographic view** — a centre (λ, φ) and a longitude span —
and draws it in **three live maps**. A library of fifty projections sits
under them. Choosing a card replaces the highlighted map. It does not add a
fourth canvas, so the page can grow past a hundred projections without becoming
a scroll of worlds.

| On the default stage | Constructor | Property protected |
| --- | --- | --- |
| Mercator | `geoMercator` | Local angles (conformal) |
| Equal Earth | `geoEqualEarth` | Area, continuous world |
| Winkel Tripel | `geoWinkel3` | Neither — a visual compromise |

The other projections are one click away, tagged by what they keep (angles,
area, distance, compromise), their family, and what they are for. The fifty
include the cylinders people confuse with Mercator (Miller, Gall stereographic,
Behrmann, Lambert cylindrical, Patterson), the atlas compromises (Natural Earth,
Robinson, Kavrayskiy VII, Van der Grinten), equal-area pseudocylindricals
(Eckert, Wagner, Hammer, Mollweide and its parents), interrupted oceans, the
gnomonic, transverse Mercator, and Peirce’s conformal square. Lessons are
curated triples.

Conics and the globe view cannot honestly show the whole sphere. Lambert
conformal conic is fitted to a spherical cap (centre 22°N, radius 78°), with
standard parallels 30° and 60°. Albers uses the USGS parallels 29.5° and 45.5°,
with the central meridian at 10°E so the shared camera still falls on the map.
Stereographic and orthographic each show one hemisphere. The countries are the
same Natural Earth 1:110m features. The difference you see is the projection,
not the data.

## Mercator

Gerardus Mercator, 1569. Cylindrical conformal. In spherical form:

- \(x = R\,\lambda\)
- \(y = R\,\ln\tan(\pi/4 + \varphi/2)\)

**Area scale** at latitude φ is \(\sec^2\varphi\). At 60° that is 4×; at 75° it
is about 14.9×; at the poles it is infinite, which is why the maps clip near
±80°. Rhumb lines (constant bearing) are straight. That is why it remains the
default of marine charts and of Web Mercator (EPSG:3857).

Web Mercator is not this spherical Mercator exactly — it uses the WGS84
ellipsoid for the input geographic coordinates, then a sphere of radius
6,378,137 m for the projection. The pedagogical point is the same: **do not
measure area in EPSG:3857**.

The country panel reports \(\sec^2\varphi\) at the feature centroid as
“Mercator appearance.” That is the infinitesimal area scale at one point, not
the integrated scale over the polygon.

## Gall–Peters

James Gall, 1855; promoted by Arno Peters from 1967 and widely from 1973.
Cylindrical equal-area with standard parallels at 45°:

- \(x = R\,\lambda\cos 45^\circ\)
- \(y = R\,\sin\varphi / \cos 45^\circ\)

Area scale is 1 everywhere. Shape is not. At the equator the meridian scale is
\(\sqrt{2}\) and the parallel scale is \(1/\sqrt{2}\), so Africa and South
America are drawn tall and narrow. Toward the poles the stretch reverses and
the poles themselves are lines, not points. It is the direct classroom reply
to Mercator: the sizes are honest, and the shapes are still a lie.

## Equal Earth

Šavrič, Patterson & Jenny, 2018. Pseudocylindrical equal-area, designed as a
visually comfortable alternative to Robinson and Winkel Tripel for world
thematic maps. Area of countries and continents can be compared. Shapes flex;
the world outline is rounded rather than rectangular. Poles are finite.

Equal Earth is the right instinct whenever the question is “how big is this
relative to that?”

## Goode Homolosine

John Paul Goode, 1923. An interrupted equal-area composite: sinusoidal in the
tropics, Mollweide toward the poles, with cuts placed in the oceans so
continents keep more of their shape. Area is still conserved. Continuity is
what is sacrificed — Tissot circles that sit on a lobe cut simply vanish.

Equal Earth and Homolosine answer the same geometric question (area) with a
different design choice: keep the world in one piece, or tear the water.
Gall–Peters answers it a third way: stay cylindrical, and accept severe shape
distortion.

## Winkel Tripel

Oswald Winkel, 1921. The arithmetic mean of the equirectangular projection
(standard parallel \(\arccos(2/\pi)\)) and the Aitoff projection. It is not
equal-area and not conformal. Both errors are moderate, which is why it
replaced Robinson as National Geographic’s world map in 1998 and why it is
often described as the projection that “looks right.”

Equal Earth was designed in part as an equal-area alternative to Robinson and
Winkel Tripel for thematic maps. Putting them on the same page is the point:
a map can look balanced and still be the wrong tool for an area question.

## Tissot’s indicatrix

Nicolas Auguste Tissot (1859, developed 1881) visualises the Jacobian of the
projection. A small circle of true geodesic radius on the globe is mapped; the
image is an ellipse whose axes are the maximum and minimum linear scales.

In this app each indicatrix is a **geodesic circle of 3° radius** (~330 km),
generated with `d3.geoCircle` and projected with the same path generator as
the countries.

| Projection | What the ellipses do |
| --- | --- |
| Mercator | Stay circular (conformal) and grow with latitude |
| Gall–Peters | Keep a constant area and stretch tall in the tropics |
| Equal Earth | Become ellipses whose *area* stays comparable |
| Homolosine | Same area rule as Equal Earth; some ellipses disappear in ocean cuts |
| Winkel Tripel | Change both size and shape, usually less violently than Mercator or Peters |

They are drawn on a 30° × 30° lattice, plus 75° to show polar inflation. Circles
that collapse or explode off the canvas (clipping, antipodes) are skipped.

This is a **finite** Tissot, not the infinitesimal one of the textbooks. At 3°
the circle already samples a range of scale, so the ellipses are slightly
“softer” than the true Jacobian. The qualitative lesson is unchanged.

## Synchronized geographic view

The canvases do not share a pixel transform. They share a `GeoView`:

```ts
type GeoView = {
  center: [lon, lat];
  lonSpan: number; // degrees of longitude visible
};
```

Pan, wheel-zoom, and a two-finger pinch write a new `GeoView`. The geographic
point under the pointer stays put while the longitude span changes. The bitmap
eases during the gesture and is reprojected when you pause. Only the three maps
on stage take part, so a large library does not make zoom heavier. In
**Synchronized** mode those maps read the same object; in **Independent** mode
each projection has its own. Scale is continuous: a world fit of the globe,
then multiplied by `360 / lonSpan`.

Explorer chips change the shared view (Africa, Greenland, Asia, …). Tapping a
country does **not** change the view — it only picks the feature for the area
panel.

## Area

Polygon area is `abs(d3.geoArea(feature)) * R²` with authalic radius
R = 6,371 km. `geoArea` is spherical (steradians on the unit sphere). Natural
Earth 1:110m is a cartographic generalization: coastlines are simplified,
disputed boundaries are a compilation choice, and small islands drop out.
Treat the numbers as **relative**, not cadastral.

## Data

- [Natural Earth](https://www.naturalearthdata.com/) `ne_110m_admin_0_countries`
  — public domain. Attributes used: `NAME`, `CONTINENT`, `ISO_A3`.
- Asia as a continent chip highlights `CONTINENT === "Asia"` and excludes
  Russia, which Natural Earth classifies as Europe.

Replace `public/data/countries-110m.geojson` with 50m or 10m data if you need
more coastline — expect a heavier canvas pass.

## Further reading

- Snyder, John P. *Map Projections — A Working Manual*. USGS Professional
  Paper 1395, 1987. (Gall–Peters as cylindrical equal-area, φ = 45°; Winkel
  Tripel.)
- Winkel, Oswald. “Neue Gradnetzentwürfe.” *Petermanns Geographische
  Mitteilungen*, 1921.
- Šavrič, Patterson, Jenny. “The Equal Earth map projection.”
  *International Journal of Geographical Information Science*, 2018.
- Goode, J. Paul. “The Homolosine projection: a new device for portraying the
  Earth’s surface entire.” *Annals of the Association of American Geographers*,
  1925.
- Tissot, N. A. *Mémoire sur la représentation des surfaces et les projections
  des cartes géographiques*, 1881.
- Natural Earth. [naturalearthdata.com](https://www.naturalearthdata.com/).
