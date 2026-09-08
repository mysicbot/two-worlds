import { REGIONS, mercatorAreaScale, type RegionId } from "@/lib/regions";
import { useAppStore } from "@/lib/store";

function formatKm2(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} million km²`;
  return `${Math.round(n).toLocaleString()} km²`;
}

export function DistortionExplorer() {
  const selected = useAppStore((s) => s.selectedRegion);
  const focusRegion = useAppStore((s) => s.focusRegion);
  const resetWorld = useAppStore((s) => s.resetWorld);
  const region = REGIONS.find((r) => r.id === selected) ?? null;

  function select(id: RegionId) {
    const r = REGIONS.find((x) => x.id === id);
    if (!r) return;
    focusRegion(id, r.names, r.continents, r.excludeNames, {
      center: r.center,
      lonSpan: r.lonSpan,
    });
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Explore</p>
          <h2 className="font-display text-2xl text-fg">Distortion Explorer</h2>
        </div>
        <button
          type="button"
          onClick={resetWorld}
          className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
        >
          World view
        </button>
      </div>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted">
        Jump to a region on both maps. The highlight is the same geography; the difference you see is
        the projection.
      </p>
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => {
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => select(r.id)}
              className={`min-h-11 rounded-sm border px-3 py-2 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border bg-elevated text-fg hover:border-accent"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {region ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <article className="rounded-md border border-border bg-elevated p-3">
            <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Area</p>
            <p className="mt-1 font-display text-xl text-fg">{formatKm2(region.trueAreaKm2)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Approximate land area. Mercator does not change this number — it changes how large the
              region is drawn.
            </p>
          </article>
          <article className="rounded-md border border-border bg-elevated p-3">
            <p className="font-mono text-[11px] tracking-[0.14em] text-mercator uppercase">Mercator</p>
            <p className="mt-1 font-display text-xl text-fg">
              ~{mercatorAreaScale(region.centroidLat).toFixed(1)}× area scale
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{region.mercatorNote}</p>
          </article>
          <article className="rounded-md border border-border bg-elevated p-3">
            <p className="font-mono text-[11px] tracking-[0.14em] text-equal uppercase">Equal Earth</p>
            <p className="mt-1 font-display text-xl text-fg">1.0× area scale</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{region.equalEarthNote}</p>
          </article>
        </div>
      ) : (
        <p className="mt-4 text-sm text-subtle">
          Select a region, or tap a country on either map for a measured comparison.
        </p>
      )}
    </section>
  );
}
