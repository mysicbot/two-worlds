import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function Controls() {
  const syncMode = useAppStore((s) => s.syncMode);
  const setSyncMode = useAppStore((s) => s.setSyncMode);
  const showGraticule = useAppStore((s) => s.showGraticule);
  const toggleGraticule = useAppStore((s) => s.toggleGraticule);
  const showTissot = useAppStore((s) => s.showTissot);
  const toggleTissot = useAppStore((s) => s.toggleTissot);
  const demoLat = useAppStore((s) => s.demoLat);
  const setDemoLat = useAppStore((s) => s.setDemoLat);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <ModeButton
            active={syncMode === "sync"}
            onClick={() => setSyncMode("sync")}
            label="Synchronized"
            hint="One geographic view"
          />
          <ModeButton
            active={syncMode === "independent"}
            onClick={() => setSyncMode("independent")}
            label="Independent"
            hint="Explore separately"
          />
          <ModeButton active={showGraticule} onClick={toggleGraticule} label="Latitude lines" hint="15° graticule" />
          <ModeButton
            active={showTissot}
            onClick={toggleTissot}
            label="Tissot indicatrix"
            hint="Circles of true scale"
          />
        </div>
        <div className="flex min-h-11 items-center gap-3 text-sm text-muted">
          <span className="shrink-0">Parallel</span>
          {mounted ? (
            <input
              type="range"
              min={0}
              max={75}
              step={5}
              value={demoLat ?? 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setDemoLat(v === 0 ? null : v);
              }}
              className="h-1.5 w-36 accent-accent sm:w-44"
              aria-label="Highlight a pair of parallels"
            />
          ) : (
            <div className="h-1.5 w-36 rounded-full bg-border sm:w-44" />
          )}
          <span className="w-10 font-mono text-xs text-fg tabular-nums">
            {demoLat === null ? "off" : `${demoLat}°`}
          </span>
        </div>
      </div>
      {showTissot ? (
        <p className="max-w-3xl text-xs leading-relaxed text-muted sm:text-sm">
          Each ellipse is a circle of equal geodesic radius (~330 km). Mercator keeps them circular
          and grows them with latitude (conformal). Equal Earth flattens them but keeps their area
          (equal-area).
        </p>
      ) : null}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-sm border px-3 py-2 text-left transition-colors ${
        active ? "border-accent bg-elevated text-fg" : "border-border text-muted hover:text-fg"
      }`}
    >
      <span className="block text-sm">{label}</span>
      <span className="block text-[11px] text-subtle">{hint}</span>
    </button>
  );
}
