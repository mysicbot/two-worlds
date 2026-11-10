import { PROJECTION_META, type ProjectionId } from "@/lib/projections";
import type { CountryCollection } from "@/lib/geojson";
import { ProjectionMap } from "./ProjectionMap";

type Props = {
  id: ProjectionId;
  collection: CountryCollection | null;
  active: boolean;
  onActivate: () => void;
};

export function MapPane({ id, collection, active, onActivate }: Props) {
  const meta = PROJECTION_META[id];

  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-surface ${
        active ? "border-accent" : "border-border"
      }`}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border px-3 py-2 sm:px-4">
        <button type="button" onClick={onActivate} className="min-w-0 text-left">
          <p className={`font-mono text-xs tracking-[0.18em] uppercase ${meta.tone}`}>{meta.year}</p>
          <h2 className="font-display text-2xl leading-tight text-fg">{meta.title}</h2>
          <p className={`mt-0.5 text-[11px] ${active ? "text-accent" : "text-subtle"}`}>
            {active ? "Library replaces this map" : "Click to replace from the library"}
          </p>
        </button>
        <p className="max-w-[11rem] shrink-0 text-right text-xs leading-snug text-muted sm:text-sm">
          {meta.subtitle}
          <span className="mt-0.5 block text-subtle">{meta.authors}</span>
        </p>
      </header>
      <div className="min-h-[220px] flex-1">
        <ProjectionMap id={id} collection={collection} />
      </div>
    </section>
  );
}
