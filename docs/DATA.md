# Data

## Natural Earth 1:110m countries

File: [`public/data/countries-110m.geojson`](../public/data/countries-110m.geojson)

Source: [Natural Earth](https://www.naturalearthdata.com/) — *Admin 0 – Countries*, 1:110 million.

Natural Earth data is public domain. This copy is bundled so the app runs
offline after `npm install` with no API key and no tile account.

### Attributes used

| Property | Use |
| --- | --- |
| `NAME` | Labels, Distortion Explorer chips, country pick |
| `CONTINENT` | Continent chips (Africa, Europe, Asia, …) |
| `ISO_A3` | Shown in the country panel when not `-99` |

### Limitations (by design)

- 1:110m is a **small-scale** product. Coastlines are generalized; microstates
  and many islands are absent.
- Disputed boundaries follow Natural Earth’s compilation, not a political
  endorsement.
- Russia is classified as **Europe**. The Asia chip therefore excludes Russia
  so East Asia, South Asia, and Southeast Asia read as one visual unit.
- Polygon area is computed on the sphere from these geometries. Do not cite
  the numbers as official land area.

To swap in 50m or 10m data, replace the GeoJSON and keep the same property
names (or update `src/lib/geojson.ts`).
