import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AreaCompare } from "@/components/AreaCompare";
import { Controls } from "@/components/Controls";
import { DistortionExplorer } from "@/components/DistortionExplorer";
import { Education } from "@/components/Education";
import { MapPane } from "@/components/MapPane";
import { loadCountries, type CountryCollection } from "@/lib/geojson";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [collection, setCollection] = useState<CountryCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              Mercator above, Equal Earth below. Same countries. Same coordinates. Different
              mathematics.
            </p>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-subtle sm:text-right">
            Natural Earth 1:110m countries · WGS84 geodesy · d3-geo Mercator & Equal Earth
          </p>
        </header>

        <Controls />

        {error ? (
          <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
            {error}
          </p>
        ) : null}

        <div className="flex min-h-[70vh] flex-col gap-3">
          <MapPane id="mercator" collection={collection} />
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] text-subtle uppercase">
            <span className="h-px flex-1 bg-border" />
            Compare
            <span className="h-px flex-1 bg-border" />
          </div>
          <MapPane id="equalEarth" collection={collection} />
        </div>

        <DistortionExplorer />
        <AreaCompare />
        <Education />

        <footer className="border-t border-border pt-4 pb-8 text-xs leading-relaxed text-subtle">
          Open geographic data from Natural Earth. Projections implemented with d3-geo (Mercator and
          Equal Earth). Indicatrices are geodesic circles of 3° radius (~330 km). Areas are spherical
          estimates from the simplified 1:110m geometries — good for comparison, not cadastral
          measurement.
        </footer>
      </div>
    </main>
  );
}
