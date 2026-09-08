import { mercatorAreaScale } from "@/lib/regions";
import { useAppStore } from "@/lib/store";

function formatKm2(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} million km²`;
  if (n >= 10_000) return `${Math.round(n).toLocaleString()} km²`;
  return `${n.toFixed(0)} km²`;
}

export function AreaCompare() {
  const picked = useAppStore((s) => s.picked);
  const pickCountry = useAppStore((s) => s.pickCountry);

  if (!picked) return null;

  const scale = mercatorAreaScale(picked.centroidLat);
  const visualVsAfricaHint =
    scale > 4
      ? "On a Mercator poster this land looks far closer in size to tropical continents than it is."
      : scale < 1.3
        ? "Near the equator Mercator barely inflates this country, so it can look small next to high-latitude land."
        : "Mid-latitude inflation is already visible: shapes stay familiar, areas start to grow.";

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Country</p>
          <h2 className="font-display text-2xl text-fg">{picked.name}</h2>
          <p className="text-sm text-muted">
            {picked.continent}
            {picked.iso && picked.iso !== "-99" ? ` · ${picked.iso}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => pickCountry(null)}
          className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted hover:text-fg"
        >
          Clear
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Geographic area"
          value={formatKm2(picked.areaKm2)}
          hint="Spherical area from the Natural Earth geometry (WGS84)."
        />
        <Stat
          label="Mercator appearance"
          value={`${scale.toFixed(2)}× at ${picked.centroidLat.toFixed(1)}°`}
          hint="Area scale factor sec²(φ) at the country centroid. The country itself does not get larger."
        />
        <Stat
          label="Equal Earth"
          value="True area"
          hint="Equal-area projection: relative country sizes stay comparable across latitudes."
        />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{visualVsAfricaHint}</p>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-md border border-border bg-elevated p-3">
      <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">{label}</p>
      <p className="mt-1 font-display text-xl text-fg">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>
    </article>
  );
}
