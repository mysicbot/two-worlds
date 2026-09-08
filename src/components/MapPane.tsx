import { PROJECTION_META, type ProjectionId } from "@/lib/projections";
import type { CountryCollection } from "@/lib/geojson";
import { ProjectionMap } from "./ProjectionMap";

type Props = {
  id: ProjectionId;
  collection: CountryCollection | null;
};

export function MapPane({ id, collection }: Props) {
  const meta = PROJECTION_META[id];
  const tone = id === "mercator" ? "text-mercator" : "text-equal";

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2 sm:px-4">
        <div>
          <p className={`font-mono text-xs tracking-[0.18em] uppercase ${tone}`}>{meta.year}</p>
          <h2 className="font-display text-2xl leading-tight text-fg sm:text-3xl">{meta.title}</h2>
        </div>
        <p className="max-w-[14rem] text-right text-xs leading-snug text-muted sm:text-sm">
          {meta.subtitle}
          <span className="mt-0.5 block text-subtle">{meta.authors}</span>
        </p>
      </header>
      <div className="min-h-[240px] flex-1 sm:min-h-[280px]">
        <ProjectionMap id={id} collection={collection} />
      </div>
    </section>
  );
}
