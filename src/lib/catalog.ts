export type ProjectionId =
  | "mercator"
  | "peters"
  | "equalEarth"
  | "homolosine"
  | "winkel"
  | "plateCarree"
  | "orthographic"
  | "azimuthalEquidistant"
  | "stereographic"
  | "lambertAzimuthal"
  | "albers"
  | "lambertConic"
  | "mollweide"
  | "sinusoidal"
  | "robinson";

export type Keeps = "angles" | "area" | "distance" | "compromise";
export type Family =
  | "cylindrical"
  | "pseudocylindrical"
  | "conic"
  | "azimuthal"
  | "interrupted"
  | "perspective";
export type Use = "world" | "hemisphere" | "pole" | "navigation" | "country" | "historical";

export type ProjectionMeta = {
  title: string;
  subtitle: string;
  year: string;
  authors: string;
  tone: string;
  keeps: Keeps[];
  families: Family[];
  uses: Use[];
  /** One sentence on the library card. */
  summary: string;
  /** Fitted to a cap, not the whole sphere. */
  partial: boolean;
};

export const KEEPS_LABEL: Record<Keeps, string> = {
  angles: "Angles",
  area: "Area",
  distance: "Distance",
  compromise: "Compromise",
};

export const FAMILY_LABEL: Record<Family, string> = {
  cylindrical: "Cylindrical",
  pseudocylindrical: "Pseudocylindrical",
  conic: "Conic",
  azimuthal: "Azimuthal",
  interrupted: "Interrupted",
  perspective: "Globe",
};

export const USE_LABEL: Record<Use, string> = {
  world: "World map",
  hemisphere: "Hemisphere",
  pole: "Polar",
  navigation: "Navigation",
  country: "Country",
  historical: "Historical",
};

export const PROJECTION_META: Record<ProjectionId, ProjectionMeta> = {
  mercator: {
    title: "Mercator",
    subtitle: "Conformal · navigation",
    year: "1569",
    authors: "Gerardus Mercator",
    tone: "text-mercator",
    keeps: ["angles"],
    families: ["cylindrical"],
    uses: ["navigation", "world", "historical"],
    summary: "Rhumb lines are straight. Area swells toward the poles.",
    partial: false,
  },
  peters: {
    title: "Gall–Peters",
    subtitle: "Equal-area · cylindrical",
    year: "1855",
    authors: "James Gall · Arno Peters",
    tone: "text-peters",
    keeps: ["area"],
    families: ["cylindrical"],
    uses: ["world", "historical"],
    summary: "True area on a cylinder. The tropics are stretched tall.",
    partial: false,
  },
  equalEarth: {
    title: "Equal Earth",
    subtitle: "Equal-area · continuous",
    year: "2018",
    authors: "Šavrič, Patterson & Jenny",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Country sizes compare, and the oceans stay in one piece.",
    partial: false,
  },
  homolosine: {
    title: "Goode Homolosine",
    subtitle: "Equal-area · interrupted",
    year: "1923",
    authors: "John Paul Goode",
    tone: "text-highlight",
    keeps: ["area"],
    families: ["interrupted", "pseudocylindrical"],
    uses: ["world"],
    summary: "Sinusoidal and Mollweide, torn in the oceans so continents behave.",
    partial: false,
  },
  winkel: {
    title: "Winkel Tripel",
    subtitle: "Compromise · continuous",
    year: "1921",
    authors: "Oswald Winkel",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Protects neither area nor angles. Both errors stay mild.",
    partial: false,
  },
  plateCarree: {
    title: "Plate Carrée",
    subtitle: "Equidistant · the data grid",
    year: "100 CE",
    authors: "Marinus of Tyre",
    tone: "text-winkel",
    keeps: ["distance"],
    families: ["cylindrical"],
    uses: ["world", "historical"],
    summary: "Longitude and latitude drawn as a square grid. How many rasters are stored.",
    partial: false,
  },
  orthographic: {
    title: "Orthographic",
    subtitle: "Perspective · one hemisphere",
    year: "150 BCE",
    authors: "Hipparchus",
    tone: "text-highlight",
    keeps: [],
    families: ["perspective", "azimuthal"],
    uses: ["hemisphere"],
    summary: "The Earth from far away. You cannot see the whole planet at once.",
    partial: true,
  },
  azimuthalEquidistant: {
    title: "Azimuthal equidistant",
    subtitle: "Distance from the centre",
    year: "11th century",
    authors: "al-Bīrūnī",
    tone: "text-accent",
    keeps: ["distance"],
    families: ["azimuthal"],
    uses: ["pole", "navigation", "world"],
    summary: "Distance and direction are true from the centre. The UN emblem is the polar case.",
    partial: false,
  },
  stereographic: {
    title: "Stereographic",
    subtitle: "Conformal · one hemisphere",
    year: "150 BCE",
    authors: "Hipparchus",
    tone: "text-mercator",
    keeps: ["angles"],
    families: ["azimuthal"],
    uses: ["pole", "hemisphere"],
    summary: "Angles held, and circles stay circles. A polar map, not a wall map of the world.",
    partial: true,
  },
  lambertAzimuthal: {
    title: "Lambert azimuthal",
    subtitle: "Equal-area · from one point",
    year: "1772",
    authors: "Johann Heinrich Lambert",
    tone: "text-equal",
    keeps: ["area"],
    families: ["azimuthal"],
    uses: ["hemisphere"],
    summary: "The same round frame as the other azimuthals, with area kept true.",
    partial: false,
  },
  albers: {
    title: "Albers",
    subtitle: "Equal-area conic · 29.5° and 45.5°",
    year: "1805",
    authors: "Heinrich Albers",
    tone: "text-peters",
    keeps: ["area"],
    families: ["conic"],
    uses: ["country"],
    summary: "The US statistical projection, with the central meridian near Greenwich so it shares this camera.",
    partial: true,
  },
  lambertConic: {
    title: "Lambert conic",
    subtitle: "Conformal · mid-latitudes",
    year: "1772",
    authors: "Johann Heinrich Lambert",
    tone: "text-mercator",
    keeps: ["angles"],
    families: ["conic"],
    uses: ["country", "navigation"],
    summary: "How many national and aeronautical charts are made. A cone, not a cylinder.",
    partial: true,
  },
  mollweide: {
    title: "Mollweide",
    subtitle: "Equal-area · ellipse",
    year: "1805",
    authors: "Karl Mollweide",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "An equal-area ellipse. The poleward half of Goode Homolosine.",
    partial: false,
  },
  sinusoidal: {
    title: "Sinusoidal",
    subtitle: "Equal-area · true parallels",
    year: "1570",
    authors: "Jean Cossin · Sanson",
    tone: "text-equal",
    keeps: ["area", "distance"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "Every parallel is true to scale. The tropical half of Goode Homolosine.",
    partial: false,
  },
  robinson: {
    title: "Robinson",
    subtitle: "Compromise · atlas classic",
    year: "1963",
    authors: "Arthur H. Robinson",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "A tabulated compromise. National Geographic’s world map before Winkel Tripel.",
    partial: false,
  },
};

export const CATALOG: ProjectionId[] = [
  "mercator",
  "peters",
  "equalEarth",
  "homolosine",
  "winkel",
  "robinson",
  "plateCarree",
  "mollweide",
  "sinusoidal",
  "orthographic",
  "azimuthalEquidistant",
  "stereographic",
  "lambertAzimuthal",
  "albers",
  "lambertConic",
];

export type Lesson = {
  id: string;
  title: string;
  detail: string;
  slots: [ProjectionId, ProjectionId, ProjectionId];
};

export const LESSONS: Lesson[] = [
  {
    id: "promises",
    title: "Angles, area, compromise",
    detail: "The three promises a classroom wall map usually makes.",
    slots: ["mercator", "equalEarth", "winkel"],
  },
  {
    id: "equal",
    title: "Three equal-area maps",
    detail: "Same area rule. A cylinder, a continuous world, and a torn ocean.",
    slots: ["peters", "equalEarth", "homolosine"],
  },
  {
    id: "parents",
    title: "Parents of Goode",
    detail: "Homolosine is the sinusoidal and the Mollweide, interrupted.",
    slots: ["sinusoidal", "mollweide", "homolosine"],
  },
  {
    id: "azimuthal",
    title: "Three azimuthals",
    detail: "One round frame. Distance, angles, or area.",
    slots: ["azimuthalEquidistant", "stereographic", "lambertAzimuthal"],
  },
  {
    id: "planet",
    title: "Data and the planet",
    detail: "The coordinate grid, the globe, and the web map.",
    slots: ["plateCarree", "orthographic", "mercator"],
  },
  {
    id: "conic",
    title: "Conics for a country",
    detail: "How mid-latitude maps are actually made, beside Mercator.",
    slots: ["albers", "lambertConic", "mercator"],
  },
];

export const DEFAULT_SLOTS: [ProjectionId, ProjectionId, ProjectionId] = LESSONS[0].slots;

export function keepsLabel(keeps: Keeps[]): string {
  if (keeps.length === 0) return "A view, not a property";
  return keeps.map((k) => KEEPS_LABEL[k]).join(" · ");
}
