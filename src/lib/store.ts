import { create } from "zustand";
import { clampView, WORLD_VIEW, type GeoView, type LonLat } from "./geo-view";
import type { ProjectionId } from "./projections";
import type { RegionId } from "./regions";

export type SyncMode = "sync" | "independent";

export type CountryPick = {
  name: string;
  continent: string;
  iso: string;
  areaKm2: number;
  centroidLat: number;
};

type AppState = {
  syncMode: SyncMode;
  view: GeoView;
  mercatorView: GeoView;
  equalView: GeoView;
  homolosineView: GeoView;
  cursor: LonLat | null;
  selectedRegion: RegionId | null;
  highlightedNames: string[];
  highlightedContinents: string[];
  excludedNames: string[];
  picked: CountryPick | null;
  showGraticule: boolean;
  showTissot: boolean;
  demoLat: number | null;
  setSyncMode: (mode: SyncMode) => void;
  setViewFor: (which: ProjectionId, view: GeoView) => void;
  setCursor: (cursor: LonLat | null) => void;
  focusRegion: (
    id: RegionId,
    names: string[],
    continents: string[] | undefined,
    excludeNames: string[] | undefined,
    view: GeoView,
  ) => void;
  pickCountry: (pick: CountryPick | null) => void;
  toggleGraticule: () => void;
  toggleTissot: () => void;
  setDemoLat: (lat: number | null) => void;
  resetWorld: () => void;
};

function allViews(view: GeoView) {
  return {
    view,
    mercatorView: view,
    equalView: view,
    homolosineView: view,
  };
}

export const useAppStore = create<AppState>((set) => ({
  syncMode: "sync",
  view: WORLD_VIEW,
  mercatorView: WORLD_VIEW,
  equalView: WORLD_VIEW,
  homolosineView: WORLD_VIEW,
  cursor: null,
  selectedRegion: null,
  highlightedNames: [],
  highlightedContinents: [],
  excludedNames: [],
  picked: null,
  showGraticule: true,
  showTissot: true,
  demoLat: null,
  setSyncMode: (syncMode) => set({ syncMode }),
  setViewFor: (which, next) =>
    set((s) => {
      const view = clampView(next);
      if (s.syncMode === "sync") return allViews(view);
      if (which === "mercator") return { mercatorView: view };
      if (which === "homolosine") return { homolosineView: view };
      return { equalView: view };
    }),
  setCursor: (cursor) => set({ cursor }),
  focusRegion: (id, names, continents, excludeNames, view) =>
    set({
      selectedRegion: id,
      highlightedNames: names,
      highlightedContinents: continents ?? [],
      excludedNames: excludeNames ?? [],
      picked: null,
      ...allViews(clampView(view)),
    }),
  pickCountry: (picked) => set({ picked }),
  toggleGraticule: () => set((s) => ({ showGraticule: !s.showGraticule })),
  toggleTissot: () => set((s) => ({ showTissot: !s.showTissot })),
  setDemoLat: (demoLat) => set({ demoLat }),
  resetWorld: () =>
    set({
      selectedRegion: null,
      highlightedNames: [],
      highlightedContinents: [],
      excludedNames: [],
      picked: null,
      ...allViews(WORLD_VIEW),
    }),
}));

export function viewFor(s: AppState, id: ProjectionId): GeoView {
  if (s.syncMode === "sync") return s.view;
  if (id === "mercator") return s.mercatorView;
  if (id === "homolosine") return s.homolosineView;
  return s.equalView;
}
