import { useMemo, useState, type ReactNode } from "react";
import {
  CATALOG,
  FAMILY_LABEL,
  KEEPS_LABEL,
  LESSONS,
  PROJECTION_META,
  USE_LABEL,
  keepsLabel,
  type Family,
  type Keeps,
  type ProjectionId,
  type Use,
} from "@/lib/catalog";
import type { CountryCollection } from "@/lib/geojson";
import { useAppStore } from "@/lib/store";
import { ProjectionThumb } from "./ProjectionThumb";

const KEEPS = Object.keys(KEEPS_LABEL) as Keeps[];
const FAMILIES = Object.keys(FAMILY_LABEL) as Family[];
const USES = Object.keys(USE_LABEL) as Use[];

export function LessonBar() {
  const slots = useAppStore((s) => s.slots);
  const applyLesson = useAppStore((s) => s.applyLesson);

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-fg">Lessons</h2>
        <p className="text-xs text-subtle">Each lesson fills the three maps. Nothing new is stacked.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LESSONS.map((lesson) => {
          const on = lesson.slots.every((id, i) => slots[i] === id);
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => applyLesson(lesson.slots)}
              className={`min-h-11 w-52 shrink-0 rounded-sm border px-3 py-2 text-left ${
                on ? "border-accent bg-elevated text-fg" : "border-border text-muted hover:text-fg"
              }`}
            >
              <span className="block text-sm">{lesson.title}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-subtle">{lesson.detail}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type Props = {
  collection: CountryCollection | null;
};

export function ProjectionLibrary({ collection }: Props) {
  const slots = useAppStore((s) => s.slots);
  const activeSlot = useAppStore((s) => s.activeSlot);
  const setSlot = useAppStore((s) => s.setSlot);
  const [query, setQuery] = useState("");
  const [keeps, setKeeps] = useState<Keeps | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [use, setUse] = useState<Use | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter((id) => {
      const meta = PROJECTION_META[id];
      if (keeps && !meta.keeps.includes(keeps)) return false;
      if (family && !meta.families.includes(family)) return false;
      if (use && !meta.uses.includes(use)) return false;
      if (!q) return true;
      const hay = `${meta.title} ${meta.authors} ${meta.year} ${meta.summary}`.toLowerCase();
      return hay.includes(q);
    });
  }, [family, keeps, query, use]);

  const activeTitle = PROJECTION_META[slots[activeSlot]].title;

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Library</p>
          <h2 className="mt-1 font-display text-2xl text-fg sm:text-3xl">Every projection, not every map</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {shown.length} of {CATALOG.length}. A card is a still picture. Choosing one replaces{" "}
            <span className="text-fg">{activeTitle}</span>, the highlighted frame. The other two stay put.
          </p>
        </div>
        <label className="block w-full sm:w-64">
          <span className="sr-only">Search projections</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="min-h-11 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
          />
        </label>
      </div>

      <FilterRow label="Keeps">
        {KEEPS.map((id) => (
          <FilterChip key={id} active={keeps === id} onClick={() => setKeeps(keeps === id ? null : id)} label={KEEPS_LABEL[id]} />
        ))}
      </FilterRow>
      <FilterRow label="Family">
        {FAMILIES.map((id) => (
          <FilterChip
            key={id}
            active={family === id}
            onClick={() => setFamily(family === id ? null : id)}
            label={FAMILY_LABEL[id]}
          />
        ))}
      </FilterRow>
      <FilterRow label="Use">
        {USES.map((id) => (
          <FilterChip key={id} active={use === id} onClick={() => setUse(use === id ? null : id)} label={USE_LABEL[id]} />
        ))}
      </FilterRow>

      {shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing in the library matches those filters.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((id) => {
            const meta = PROJECTION_META[id];
            const onStage = slots.indexOf(id);
            const isTarget = slots[activeSlot] === id;
            return (
              <li key={id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setSlot(activeSlot, id)}
                  className={`flex h-full w-full flex-col gap-2 rounded-md border p-2 text-left ${
                    isTarget ? "border-accent bg-elevated" : "border-border hover:border-accent/60"
                  }`}
                >
                  <ProjectionThumb id={id} collection={collection} />
                  <span className="min-w-0">
                    <span className={`block font-mono text-[10px] tracking-[0.14em] uppercase ${meta.tone}`}>
                      {keepsLabel(meta.keeps)}
                    </span>
                    <span className="mt-0.5 block text-sm text-fg">{meta.title}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-subtle">{meta.summary}</span>
                    {onStage >= 0 ? (
                      <span className="mt-1 block text-[11px] text-accent">
                        {isTarget ? "In the highlighted frame" : `On stage · map ${onStage + 1}`}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
      <p className="w-16 shrink-0 pt-1.5 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 rounded-sm border px-2.5 py-1 text-xs ${
        active ? "border-accent bg-elevated text-fg" : "border-border text-muted hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}
