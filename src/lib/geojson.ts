export type CountryProps = {
  NAME: string;
  ADMIN: string;
  CONTINENT: string;
  ISO_A3: string;
};

export type CountryFeature = {
  type: "Feature";
  properties: CountryProps;
  geometry: GeoJSON.Geometry;
};

export type CountryCollection = {
  type: "FeatureCollection";
  features: CountryFeature[];
};

let cached: Promise<CountryCollection> | null = null;

export function loadCountries(): Promise<CountryCollection> {
  if (!cached) {
    const url = `${import.meta.env.BASE_URL}data/countries-110m.geojson`;
    cached = fetch(url).then(async (res) => {
      if (!res.ok) throw new Error("Could not load Natural Earth countries.");
      return res.json() as Promise<CountryCollection>;
    });
  }
  return cached;
}

export function featureMatches(
  feature: CountryFeature,
  names: string[],
  continents: string[],
  excludeNames: string[] = [],
): boolean {
  if (excludeNames.includes(feature.properties.NAME)) return false;
  if (names.length && names.includes(feature.properties.NAME)) return true;
  if (continents.length && continents.includes(feature.properties.CONTINENT)) return true;
  return false;
}