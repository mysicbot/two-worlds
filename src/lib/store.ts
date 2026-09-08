import { create } from "zustand";
import { clampView, WORLD_VIEW, type GeoView } from "./geo-view";
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
  selectedRegion: RegionId | null;
  highlightedNames: string[];
  highlightedContinents: string[];
  excludedNames: string[];
  picked: CountryPick | null;
  showGraticule: boolean;
  showTissot: boolean;
  demoLat: number | null;
  setSyncMode: (mode: SyncMode) => void;
  setViewFor: (which: "mercator" | "equalEarth", view: GeoView) => void;
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

export const useAppStore = create<AppState>((set) => ({
  syncMode: "sync",
  view: WORLD_VIEW,
  mercatorView: WORLD_VIEW,
  equalView: WORLD_VIEW,
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
      if (s.syncMode === "sync") {
        return { view, mercatorView: view, equalView: view };
      }
      if (which === "mercator") return { mercatorView: view };
      return { equalView: view };
    }),
  focusRegion: (id, names, continents, excludeNames, view) =>
    set({
      selectedRegion: id,
      highlightedNames: names,
      highlightedContinents: continents ?? [],
      excludedNames: excludeNames ?? [],
      picked: null,
      view: clampView(view),
      mercatorView: clampView(view),
      equalView: clampView(view),
    }),
  pickCountry: (picked) => set({ picked }),
  toggleGraticule: () => set((s) => ({ showGraticule: !s.showGraticule })),
  toggleTissot: () => set((s) => ({ showTissot: !s.showTissot })),
  setDemoLat: (demoLat) => set({ demoLat }),
  resetWorld: () =>
    set({
      view: WORLD_VIEW,
      mercatorView: WORLD_VIEW,
      equalView: WORLD_VIEW,
      selectedRegion: null,
      highlightedNames: [],
      highlightedContinents: [],
      excludedNames: [],
      picked: null,
    }),
}));
