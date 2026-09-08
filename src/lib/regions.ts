export type RegionId =
  | "africa"
  | "canada"
  | "greenland"
  | "europe"
  | "asia"
  | "india"
  | "china"
  | "japan"
  | "usa"
  | "australia"
  | "south-america"
  | "antarctica";

export type Region = {
  id: RegionId;
  label: string;
  names: string[];
  continents?: string[];
  excludeNames?: string[];
  center: [number, number];
  lonSpan: number;
  trueAreaKm2: number;
  centroidLat: number;
  mercatorNote: string;
  equalEarthNote: string;
};

export const REGIONS: Region[] = [
  {
    id: "africa",
    label: "Africa",
    names: [],
    continents: ["Africa"],
    center: [20, 2],
    lonSpan: 90,
    trueAreaKm2: 30_370_000,
    centroidLat: 2,
    mercatorNote:
      "Near the equator the Mercator scale factor is close to 1. Africa is one of the least inflated landmasses on a Mercator world map — which is why it often looks smaller than it is relative to Europe or North America.",
    equalEarthNote:
      "Equal Earth keeps Africa’s area honest. It is larger than China, the United States, and India combined. Comparing the two maps at this view is the cleanest way to see how mid-latitude inflation shrinks tropical continents by comparison.",
  },
  {
    id: "canada",
    label: "Canada",
    names: ["Canada"],
    center: [-96, 60],
    lonSpan: 95,
    trueAreaKm2: 9_985_000,
    centroidLat: 56,
    mercatorNote:
      "Canada stretches from about 42°N to 83°N. Mercator’s area scale is sec²(φ), so the high Arctic is inflated several times over. The Canadian Arctic Archipelago looks enormous compared with southern Ontario.",
    equalEarthNote:
      "Equal Earth restores the true area relationship between Canada and, for example, the United States or Brazil. Canada remains a vast country, but the polar islands no longer dominate the frame.",
  },
  {
    id: "greenland",
    label: "Greenland",
    names: ["Greenland"],
    center: [-42, 72],
    lonSpan: 55,
    trueAreaKm2: 2_166_000,
    centroidLat: 72,
    mercatorNote:
      "The classic classroom example. At ~72°N, Mercator’s linear scale is about 1 / cos(72°) ≈ 3.2× and area scale is about 10×. Greenland is drawn roughly the size of Africa on many wall maps; its true area is about 1/14 of Africa.",
    equalEarthNote:
      "Equal Earth draws Greenland at its true area (~2.17 million km²). It is still large — about three times Texas — but no longer a stand-in for a continent.",
  },
  {
    id: "europe",
    label: "Europe",
    names: [],
    continents: ["Europe"],
    excludeNames: ["Russia"],
    center: [15, 54],
    lonSpan: 55,
    trueAreaKm2: 10_180_000,
    centroidLat: 54,
    mercatorNote:
      "Western and Central Europe sit near 45–60°N, where Mercator already inflates area by about 2–4×. That is one reason Europe looks larger relative to Africa than it is.",
    equalEarthNote:
      "On Equal Earth, Europe reads as a compact peninsula of Eurasia. The area comparison with Africa and South America is the correction most people notice first.",
  },
  {
    id: "asia",
    label: "Asia",
    names: [],
    continents: ["Asia"],
    center: [88, 28],
    lonSpan: 130,
    trueAreaKm2: 44_580_000,
    centroidLat: 29,
    mercatorNote:
      "Asia spans the equator to the Arctic. Mercator therefore treats Indonesia almost fairly and inflates Kazakhstan, Mongolia, and Japan. Natural Earth classifies Russia as Europe, so Siberia is not in this highlight — otherwise it would swallow the frame.",
    equalEarthNote:
      "Equal Earth is the right language for a continent this large. India, China, and the Southeast Asian archipelago keep their area rank against Europe and North America, which Mercator world maps routinely invert.",
  },
  {
    id: "india",
    label: "India",
    names: ["India"],
    center: [79, 22],
    lonSpan: 38,
    trueAreaKm2: 3_287_000,
    centroidLat: 21,
    mercatorNote:
      "India sits near 8–35°N, so Mercator inflation is modest (~1.1× at the centroid). That is why a Mercator atlas can make India look smaller than Greenland, which is actually two-thirds India’s area.",
    equalEarthNote:
      "On Equal Earth, India (~3.29 million km²) is clearly larger than Greenland (~2.17 million km²). Pair this view with the Greenland chip — it is the second-best classroom shock after Africa.",
  },
  {
    id: "china",
    label: "China",
    names: ["China"],
    center: [104, 36],
    lonSpan: 58,
    trueAreaKm2: 9_597_000,
    centroidLat: 35,
    mercatorNote:
      "China’s bulk sits near 20–50°N (area scale ~1.1–2.4×). The northern interior grows more than the south, so the country looks slightly ‘taller’ on Mercator than it is.",
    equalEarthNote:
      "China, the United States, and Canada are in the same area class (~9.5–10 million km²). Equal Earth keeps that three-way comparison honest; Mercator awards extra paper to Canada because so much of it is Arctic.",
  },
  {
    id: "japan",
    label: "Japan",
    names: ["Japan"],
    center: [138, 37],
    lonSpan: 28,
    trueAreaKm2: 378_000,
    centroidLat: 36,
    mercatorNote:
      "Japan is a mid-latitude archipelago. Mercator is conformal, so local island shapes and compass bearings stay familiar — the reason a navigation chart of Honshu still looks like Honshu.",
    equalEarthNote:
      "Equal Earth preserves Japan’s area (~378,000 km²) but not its angles. The arc shears a little. That is the equal-area bargain: size is true, shape is negotiated.",
  },
  {
    id: "usa",
    label: "United States",
    names: ["United States of America"],
    center: [-98, 40],
    lonSpan: 60,
    trueAreaKm2: 9_834_000,
    centroidLat: 40,
    mercatorNote:
      "The contiguous states sit near 30–49°N (area scale ~1.3–2.3×). Alaska, much farther north, is inflated far more — which is why it looks oversized on a Mercator world map relative to the Lower 48.",
    equalEarthNote:
      "Equal Earth keeps the Lower 48 and Alaska in true area proportion. The United States and Canada are close in total area; Mercator makes Canada look far larger because so much of it is Arctic.",
  },
  {
    id: "australia",
    label: "Australia",
    names: ["Australia"],
    center: [134, -25],
    lonSpan: 55,
    trueAreaKm2: 7_692_000,
    centroidLat: -25,
    mercatorNote:
      "Australia sits at mid-southern latitudes, so Mercator inflation is moderate. It is still under-emphasized next to inflated Eurasia. True area is close to that of the contiguous United States.",
    equalEarthNote:
      "Equal Earth shows Australia as a large continent-country — bigger than Europe without Russia, and similar in area to the contiguous U.S.",
  },
  {
    id: "south-america",
    label: "South America",
    names: [],
    continents: ["South America"],
    center: [-60, -15],
    lonSpan: 70,
    trueAreaKm2: 17_840_000,
    centroidLat: -15,
    mercatorNote:
      "Most of South America lies in the tropics, so Mercator does not inflate it much. Brazil alone (~8.5 million km²) is larger than the contiguous United States, a fact Mercator world maps tend to hide.",
    equalEarthNote:
      "Equal Earth makes the bulk of South America obvious. Compare Brazil with Greenland or with Europe: the area ranking reverses from what a classroom Mercator poster implies.",
  },
  {
    id: "antarctica",
    label: "Antarctica",
    names: ["Antarctica"],
    center: [0, -78],
    lonSpan: 360,
    trueAreaKm2: 14_200_000,
    centroidLat: -80,
    mercatorNote:
      "Web Mercator and classic Mercator clip near ±85°. Antarctica is either sliced off or stretched toward infinity as scale grows without bound at the pole. That is a property of the mathematics, not of the ice sheet.",
    equalEarthNote:
      "Equal Earth includes both poles at finite scale and true area. Antarctica is the fifth-largest continent (~14 million km²) — larger than Europe, smaller than South America.",
  },
];

/** Mercator area scale factor at geodetic latitude φ (degrees). */
export function mercatorAreaScale(latDeg: number): number {
  const phi = (latDeg * Math.PI) / 180;
  const c = Math.cos(phi);
  if (c < 0.02) return 2500;
  return 1 / (c * c);
}
