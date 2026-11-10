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
  | "robinson"
  | "miller"
  | "gallStereo"
  | "behrmann"
  | "lambertCylindrical"
  | "patterson"
  | "naturalEarth"
  | "naturalEarth2"
  | "kavrayskiy7"
  | "eckert4"
  | "eckert6"
  | "wagner4"
  | "wagner6"
  | "wagner7"
  | "hammer"
  | "aitoff"
  | "times"
  | "fahey"
  | "craster"
  | "boggs"
  | "mcbrydeThomas"
  | "collignon"
  | "healpix"
  | "homolosineContinuous"
  | "laskowski"
  | "loximuthal"
  | "interruptedMollweide"
  | "interruptedSinusoidal"
  | "interruptedBoggs"
  | "vanDerGrinten"
  | "bonne"
  | "polyconic"
  | "conicEquidistant"
  | "gnomonic"
  | "transverseMercator"
  | "peirce";

export type Keeps = "angles" | "area" | "distance" | "compromise";
export type Family =
  | "cylindrical"
  | "pseudocylindrical"
  | "conic"
  | "azimuthal"
  | "interrupted"
  | "perspective"
  | "polyhedral"
  | "other";
export type Use = "world" | "hemisphere" | "pole" | "navigation" | "country" | "historical";

export type ProjectionMeta = {
  title: string;
  subtitle: string;
  year: string;
  authors: string;
  tone: string;
  /** Overrides the small label when “what it keeps” is not the lesson. */
  badge?: string;
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
  polyhedral: "Polyhedral",
  other: "Other",
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
  miller: {
    title: "Miller",
    subtitle: "Compromise · cylindrical",
    year: "1942",
    authors: "Osborn Maitland Miller",
    tone: "text-mercator",
    keeps: ["compromise"],
    families: ["cylindrical"],
    uses: ["world"],
    summary: "Mercator’s look, with the poles pulled back onto the page.",
    partial: false,
  },
  gallStereo: {
    title: "Gall stereographic",
    subtitle: "Compromise · cylindrical",
    year: "1855",
    authors: "James Gall",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["cylindrical"],
    uses: ["world", "historical"],
    summary: "Gall’s other cylinder, standard parallel 45°. Less wild than Mercator, area still wrong.",
    partial: false,
  },
  behrmann: {
    title: "Behrmann",
    subtitle: "Equal-area · parallels 30°",
    year: "1910",
    authors: "Walter Behrmann",
    tone: "text-peters",
    keeps: ["area"],
    families: ["cylindrical"],
    uses: ["world"],
    summary: "Peters’ idea with the standard parallels at 30° instead of 45°.",
    partial: false,
  },
  lambertCylindrical: {
    title: "Lambert cylindrical",
    subtitle: "Equal-area · equator true",
    year: "1772",
    authors: "Johann Heinrich Lambert",
    tone: "text-peters",
    keeps: ["area"],
    families: ["cylindrical"],
    uses: ["world", "historical"],
    summary: "The original equal-area cylinder. True on the equator, stretched everywhere else.",
    partial: false,
  },
  patterson: {
    title: "Patterson",
    subtitle: "Compromise · for the screen",
    year: "2014",
    authors: "Tom Patterson",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["cylindrical"],
    uses: ["world"],
    summary: "A cylinder drawn for web maps. High latitudes swell less than on Mercator.",
    partial: false,
  },
  naturalEarth: {
    title: "Natural Earth",
    subtitle: "Compromise · pseudocylindrical",
    year: "2011",
    authors: "Patterson, Šavrič & Jenny",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Drawn to look familiar. This is a projection, not the Natural Earth dataset.",
    partial: false,
  },
  naturalEarth2: {
    title: "Natural Earth II",
    subtitle: "Compromise · short pole lines",
    year: "2015",
    authors: "Patterson, Šavrič & Jenny",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "The rounded sibling. Short poles, and less side-bulge than Mollweide.",
    partial: false,
  },
  kavrayskiy7: {
    title: "Kavrayskiy VII",
    subtitle: "Compromise · straight parallels",
    year: "1939",
    authors: "Vladimir V. Kavrayskiy",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "A simple compromise used on Soviet world maps. Straight, evenly spaced parallels.",
    partial: false,
  },
  eckert4: {
    title: "Eckert IV",
    subtitle: "Equal-area · pole lines",
    year: "1906",
    authors: "Max Eckert",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Equal-area, poles as lines. A workhorse of thematic atlases.",
    partial: false,
  },
  eckert6: {
    title: "Eckert VI",
    subtitle: "Equal-area · sinusoidal meridians",
    year: "1906",
    authors: "Max Eckert",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Equal-area like Eckert IV, with sinusoidal meridians instead of elliptical ones.",
    partial: false,
  },
  wagner4: {
    title: "Wagner IV",
    subtitle: "Equal-area · pole line",
    year: "1932",
    authors: "Karlheinz Wagner",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "An equal-area pseudocylindrical with a pole line. Also called Putniņš P2′.",
    partial: false,
  },
  wagner6: {
    title: "Wagner VI",
    subtitle: "Compromise · equidistant axes",
    year: "1932",
    authors: "Karlheinz Wagner",
    tone: "text-winkel",
    keeps: ["compromise", "distance"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Close to Kavrayskiy VII, different proportions. True scale on the equator and central meridian.",
    partial: false,
  },
  wagner7: {
    title: "Wagner VII",
    subtitle: "Equal-area · Hammer with a pole line",
    year: "1941",
    authors: "Karlheinz Wagner",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Hammer, rewritten so the poles are lines instead of points.",
    partial: false,
  },
  hammer: {
    title: "Hammer",
    subtitle: "Equal-area · oval",
    year: "1892",
    authors: "Ernst Hammer",
    tone: "text-equal",
    keeps: ["area"],
    families: ["azimuthal"],
    uses: ["world", "historical"],
    summary: "An equal-area oval. Aitoff’s construction applied to the Lambert azimuthal.",
    partial: false,
  },
  aitoff: {
    title: "Aitoff",
    subtitle: "Compromise · oval",
    year: "1889",
    authors: "David Aitoff",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["azimuthal"],
    uses: ["world", "historical"],
    summary: "The compromise oval Winkel later averaged with the plate carrée.",
    partial: false,
  },
  times: {
    title: "Times",
    subtitle: "Compromise · atlas oval",
    year: "1962",
    authors: "John Bartholomew",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "The oval used in many Times atlases. A compromise, not a property.",
    partial: false,
  },
  fahey: {
    title: "Fahey",
    subtitle: "Compromise · modified Gall",
    year: "1975",
    authors: "Lawrence Fahey",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "A modified Gall stereographic. Poles are lines, and the tropics are less stretched.",
    partial: false,
  },
  craster: {
    title: "Craster parabolic",
    subtitle: "Equal-area · parabolic meridians",
    year: "1929",
    authors: "John Craster",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Equal-area, with parabolic meridians. Also called Putniņš P4.",
    partial: false,
  },
  boggs: {
    title: "Boggs eumorphic",
    subtitle: "Equal-area · averaged",
    year: "1929",
    authors: "S. Whittemore Boggs",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "The average of the sinusoidal and the Mollweide. Equal-area, and a parent of the interrupted Boggs.",
    partial: false,
  },
  mcbrydeThomas: {
    title: "McBryde–Thomas",
    subtitle: "Equal-area · flat-polar quartic",
    year: "1949",
    authors: "McBryde & Thomas",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Equal-area, poles as lines, meridians as fourth-order curves. A thematic-atlas classic.",
    partial: false,
  },
  collignon: {
    title: "Collignon",
    subtitle: "Equal-area · a triangle",
    year: "1865",
    authors: "Édouard Collignon",
    tone: "text-highlight",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world", "historical"],
    summary: "The whole Earth in a triangle. Area is true. Shapes at the south pole are not.",
    partial: false,
  },
  healpix: {
    title: "HEALPix",
    subtitle: "Equal-area · isolatitude",
    year: "2005",
    authors: "Górski and others",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "The equal-area grid of the cosmic microwave background, turned onto the Earth.",
    partial: false,
  },
  homolosineContinuous: {
    title: "Homolosine",
    subtitle: "Equal-area · not yet cut",
    year: "1923",
    authors: "John Paul Goode",
    tone: "text-equal",
    keeps: ["area"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "Sinusoidal in the tropics, Mollweide toward the poles, still in one piece.",
    partial: false,
  },
  laskowski: {
    title: "Laskowski",
    subtitle: "Compromise · tri-optimal",
    year: "1991",
    authors: "Piotr Laskowski",
    tone: "text-winkel",
    keeps: ["compromise"],
    families: ["pseudocylindrical"],
    uses: ["world"],
    summary: "A polynomial fit that tries to keep area, angle, and distance errors all small.",
    partial: false,
  },
  loximuthal: {
    title: "Loximuthal",
    subtitle: "Rhumb lines from one parallel",
    year: "1935",
    authors: "Karl Siemon · Waldo Tobler",
    tone: "text-accent",
    keeps: ["distance"],
    families: ["pseudocylindrical"],
    uses: ["navigation", "world"],
    summary: "Rhumb lines from a chosen parallel are straight, and true to scale.",
    partial: false,
  },
  interruptedMollweide: {
    title: "Interrupted Mollweide",
    subtitle: "Equal-area · oceans cut",
    year: "1805",
    authors: "Mollweide · interrupted",
    tone: "text-equal",
    keeps: ["area"],
    families: ["interrupted", "pseudocylindrical"],
    uses: ["world"],
    summary: "The Mollweide oval, torn so each land mass sits nearer a central meridian.",
    partial: false,
  },
  interruptedSinusoidal: {
    title: "Interrupted sinusoidal",
    subtitle: "Equal-area · oceans cut",
    year: "1570",
    authors: "Sanson · interrupted",
    tone: "text-equal",
    keeps: ["area"],
    families: ["interrupted", "pseudocylindrical"],
    uses: ["world"],
    summary: "The sinusoidal, split along the oceans. Parallels stay true to scale.",
    partial: false,
  },
  interruptedBoggs: {
    title: "Interrupted Boggs",
    subtitle: "Equal-area · oceans cut",
    year: "1929",
    authors: "S. Whittemore Boggs",
    tone: "text-equal",
    keeps: ["area"],
    families: ["interrupted", "pseudocylindrical"],
    uses: ["world"],
    summary: "Boggs eumorphic, interrupted. Area kept. The tears are the design.",
    partial: false,
  },
  vanDerGrinten: {
    title: "Van der Grinten I",
    subtitle: "Compromise · a circle",
    year: "1904",
    authors: "Alphons J. van der Grinten",
    tone: "text-highlight",
    keeps: ["compromise"],
    families: ["other"],
    uses: ["world", "historical"],
    summary: "National Geographic’s world map from 1922 to 1988. The world in a circle.",
    partial: false,
  },
  bonne: {
    title: "Bonne",
    subtitle: "Equal-area · heart-shaped",
    year: "1752",
    authors: "Rigobert Bonne",
    tone: "text-equal",
    keeps: ["area"],
    families: ["conic"],
    uses: ["world", "historical"],
    summary: "A heart-shaped equal-area map. True scale along the central meridian and one parallel.",
    partial: false,
  },
  polyconic: {
    title: "American polyconic",
    subtitle: "Each parallel true",
    year: "1820",
    authors: "Ferdinand Hassler",
    tone: "text-accent",
    keeps: ["distance"],
    families: ["conic"],
    uses: ["country", "historical"],
    summary: "The projection of older USGS topographic sheets. Every parallel is its own cone.",
    partial: false,
  },
  conicEquidistant: {
    title: "Equidistant conic",
    subtitle: "Distance along the meridians",
    year: "150 CE",
    authors: "Ptolemy",
    tone: "text-accent",
    keeps: ["distance"],
    families: ["conic"],
    uses: ["country", "historical"],
    summary: "Meridians are true to scale between two standard parallels. A regional map, not a world one.",
    partial: true,
  },
  gnomonic: {
    title: "Gnomonic",
    subtitle: "Great circles are straight",
    year: "Antiquity",
    authors: "Thales, as told",
    tone: "text-highlight",
    keeps: [],
    badge: "Great circles",
    families: ["azimuthal"],
    uses: ["navigation", "hemisphere"],
    summary: "The shortest path on the globe is a straight line on the map. Only a hemisphere will fit.",
    partial: true,
  },
  transverseMercator: {
    title: "Transverse Mercator",
    subtitle: "Conformal · the UTM projection",
    year: "1772",
    authors: "Johann Heinrich Lambert",
    tone: "text-mercator",
    keeps: ["angles"],
    families: ["cylindrical"],
    uses: ["country", "navigation"],
    summary: "Mercator turned on its side. Honest in a narrow zone. This is what a UTM zone is.",
    partial: false,
  },
  peirce: {
    title: "Peirce quincuncial",
    subtitle: "Conformal · a square tile",
    year: "1879",
    authors: "Charles Sanders Peirce",
    tone: "text-mercator",
    keeps: ["angles"],
    families: ["polyhedral"],
    uses: ["world", "historical"],
    summary: "A conformal square. The world is folded so the map can tile the plane.",
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
  "miller",
  "gallStereo",
  "behrmann",
  "lambertCylindrical",
  "patterson",
  "naturalEarth",
  "naturalEarth2",
  "kavrayskiy7",
  "eckert4",
  "eckert6",
  "wagner4",
  "wagner6",
  "wagner7",
  "hammer",
  "aitoff",
  "times",
  "fahey",
  "craster",
  "boggs",
  "mcbrydeThomas",
  "collignon",
  "healpix",
  "homolosineContinuous",
  "laskowski",
  "loximuthal",
  "interruptedMollweide",
  "interruptedSinusoidal",
  "interruptedBoggs",
  "vanDerGrinten",
  "bonne",
  "polyconic",
  "conicEquidistant",
  "gnomonic",
  "transverseMercator",
  "peirce",
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
  {
    id: "not-mercator",
    title: "Not quite Mercator",
    detail: "Three cylinders. Only one of them keeps angles.",
    slots: ["mercator", "miller", "behrmann"],
  },
];

export const DEFAULT_SLOTS: [ProjectionId, ProjectionId, ProjectionId] = LESSONS[0].slots;

export function keepsLabel(keeps: Keeps[]): string {
  if (keeps.length === 0) return "A view, not a property";
  return keeps.map((k) => KEEPS_LABEL[k]).join(" · ");
}
