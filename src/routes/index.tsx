import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AreaCompare } from "@/components/AreaCompare";
import { Controls } from "@/components/Controls";
import { DistortionExplorer } from "@/components/DistortionExplorer";
import { Education } from "@/components/Education";
import { MapPane } from "@/components/MapPane";
import { LessonBar, ProjectionLibrary } from "@/components/ProjectionLibrary";
import { CATALOG } from "@/lib/catalog";
import { loadCountries, type CountryCollection } from "@/lib/geojson";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [collection, setCollection] = useState<CountryCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const slots = useAppStore((s) => s.slots);
  const activeSlot = useAppStore((s) => s.activeSlot);
  const setActiveSlot = useAppStore((s) => s.setActiveSlot);

  useEffect(() => {
    loadCountries()
      .then(setCollection)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load map data.");
      });
  }, []);

  return (
    <main className="min-h-svh bg-bg text-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8">
        <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">
              Two Worlds
            </p>
            <h1 className="font-display text-4xl leading-none text-fg sm:text-5xl">
              Exploring Map Projections
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Three maps at a time, chosen from a library of {CATALOG.length}. Same countries. Same
              coordinates. Different mathematics.
            </p>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-subtle sm:text-right">
            Natural Earth 1:110m countries · WGS84 · {CATALOG.length} projections, three on stage
          </p>
        </header>

        <Controls />
        <LessonBar />

        {error ? (
          <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {slots.map((id, index) => (
            <div key={id} className="min-h-[260px] sm:min-h-[300px]">
              <MapPane
                id={id}
                collection={collection}
                active={activeSlot === index}
                onActivate={() => setActiveSlot(index as 0 | 1 | 2)}
              />
            </div>
          ))}
        </div>

        <ProjectionLibrary collection={collection} />

        <DistortionExplorer />
        <AreaCompare />
        <Education />

        <footer className="border-t border-border pt-4 pb-8 text-xs leading-relaxed text-subtle">
          Open geographic data from Natural Earth. The stage draws three projections; the library holds{" "}
          {CATALOG.length}, ready for more. Indicatrices are geodesic circles of 3° radius (~330 km).
          Areas are spherical estimates from the simplified 1:110m geometries — good for comparison,
          not cadastral measurement.
        </footer>
      </div>
    </main>
  );
}
