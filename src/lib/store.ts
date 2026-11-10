import { create } from "zustand";
import { DEFAULT_SLOTS, type ProjectionId } from "./catalog";
import { clampView, WORLD_VIEW, type GeoView, type LonLat } from "./geo-view";
import type { RegionId } from "./regions";

export type SyncMode = "sync" | "independent";

export type CountryPick = {
  name: string;
  continent: string;
  iso: string;
  areaKm2: number;
  centroidLat: number;
};

type Slots = [ProjectionId, ProjectionId, ProjectionId];

type AppState = {
  syncMode: SyncMode;
  view: GeoView;
  views: Partial<Record<ProjectionId, GeoView>>;
  slots: Slots;
  activeSlot: 0 | 1 | 2;
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
  setActiveSlot: (slot: 0 | 1 | 2) => void;
  setSlot: (slot: 0 | 1 | 2, id: ProjectionId) => void;
  applyLesson: (slots: Slots) => void;
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

function sharedView(view: GeoView) {
  return { view, views: {} as AppState["views"] };
}

export const useAppStore = create<AppState>((set) => ({
  syncMode: "sync",
  view: WORLD_VIEW,
  views: {},
  slots: DEFAULT_SLOTS,
  activeSlot: 2,
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
      if (s.syncMode === "sync") return sharedView(view);
      return { views: { ...s.views, [which]: view } };
    }),
  setCursor: (cursor) => set({ cursor }),
  setActiveSlot: (activeSlot) => set({ activeSlot }),
  setSlot: (slot, id) =>
    set((s) => {
      const slots: Slots = [s.slots[0], s.slots[1], s.slots[2]];
      const existing = slots.indexOf(id);
      if (existing === slot) return { activeSlot: slot };
      if (existing >= 0) slots[existing] = slots[slot];
      slots[slot] = id;
      return { slots, activeSlot: slot };
    }),
  applyLesson: (slots) => set({ slots: [slots[0], slots[1], slots[2]], activeSlot: 2 }),
  focusRegion: (id, names, continents, excludeNames, view) =>
    set({
      selectedRegion: id,
      highlightedNames: names,
      highlightedContinents: continents ?? [],
      excludedNames: excludeNames ?? [],
      picked: null,
      ...sharedView(clampView(view)),
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
      ...sharedView(WORLD_VIEW),
    }),
}));

export function viewFor(s: AppState, id: ProjectionId): GeoView {
  if (s.syncMode === "sync") return s.view;
  return s.views[id] ?? s.view;
}
