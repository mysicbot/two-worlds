import { useEffect, useState } from "react";
import { motionOk, useOnScreen } from "./hooks";

function outline(t: number) {
  const cx = 160;
  const cy = 112;
  const r = 70;
  const halfW = 116;
  const halfH = 70;
  const pts: string[] = [];
  for (let i = 0; i <= 72; i += 1) {
    const a = (i / 72) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const xr = cx + c * r;
    const yr = cy + s * r;
    const sx = Math.abs(c) < 0.001 ? Infinity : halfW / Math.abs(c);
    const sy = Math.abs(s) < 0.001 ? Infinity : halfH / Math.abs(s);
    const m = Math.min(sx, sy);
    const x = xr + (cx + c * m - xr) * t;
    const y = yr + (cy + s * m - yr) * t;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

function meridian(i: number, t: number) {
  const u = i / 4;
  const xFlat = 160 + (u - 0.5) * 232;
  const x = 160 * (1 - t) + xFlat * t;
  const bulge = (u - 0.5) * 150 * (1 - t);
  return `M ${x.toFixed(1)} 42 Q ${(x + bulge).toFixed(1)} 112 ${x.toFixed(1)} 182`;
}

function parallel(j: number, t: number) {
  const v = j / 4;
  const y = 42 + v * 140;
  const dy = y - 112;
  const halfRound = Math.sqrt(Math.max(0, 70 * 70 - dy * dy));
  const half = halfRound * (1 - t) + 116 * t;
  return `M ${(160 - half).toFixed(1)} ${y.toFixed(1)} L ${(160 + half).toFixed(1)} ${y.toFixed(1)}`;
}

export function SpreadsheetMap() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [auto, setAuto] = useState(0);
  const [held, setHeld] = useState(0);
  const [user, setUser] = useState(false);
  const t = user ? held : auto;

  useEffect(() => {
    if (user || !visible || !motionOk()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = ((now - t0) / 7000) % 1;
      const tri = u < 0.5 ? u * 2 : (1 - u) * 2;
      setAuto(tri);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [user, visible]);

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption>
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Do not plot the numbers as x and y</p>
        <p className="mt-1 text-sm text-fg">
          {t < 0.45
            ? "On a ball, the pole is one point. Every north–south line meets there."
            : "If you treat the numbers like columns in a spreadsheet, that one point becomes a whole edge."}
        </p>
      </figcaption>
      <svg viewBox="0 0 320 210" className="mt-1 h-auto w-full" role="img" aria-label="A round grid stretching until the pole becomes the top edge of a rectangle">
        <defs>
          <clipPath id="sheet-clip">
            <path d={outline(t)} />
          </clipPath>
        </defs>
        <path d={outline(t)} className="fill-ocean" />
        <g clipPath="url(#sheet-clip)">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={`m${i}`}
              d={meridian(i, t)}
              fill="none"
              className={i === 2 ? "text-highlight" : "text-muted"}
              stroke="currentColor"
              strokeWidth={i === 2 ? 1.7 : 1}
            />
          ))}
          {[0, 1, 2, 3, 4].map((j) => (
            <path
              key={`p${j}`}
              d={parallel(j, t)}
              fill="none"
              className={j === 2 ? "text-accent" : "text-muted"}
              stroke="currentColor"
              strokeWidth={j === 2 ? 1.7 : 1}
            />
          ))}
        </g>
        <path d={outline(t)} fill="none" className="text-fg" stroke="currentColor" strokeWidth="1.4" />
        <text x="292" y="108" textAnchor="end" className="fill-accent text-[10px]">
          equator
        </text>
      </svg>
      <label className="flex items-center gap-3 text-sm text-muted">
        <span className="shrink-0">Ball</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(t * 100)}
          onChange={(e) => {
            setUser(true);
            setHeld(Number(e.target.value) / 100);
          }}
          className="h-1.5 w-full accent-accent"
          aria-label="From a ball to a spreadsheet map"
        />
        <span className="shrink-0">Flat grid</span>
      </label>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The gold line is the zero of longitude. The sage line is the equator. The top of the ball is the north pole.
        Watch the top. A point should not turn into a line. This flat version has a name, plate carrée. It is in the
        library. It is the spreadsheet version of the Earth.
      </p>
    </figure>
  );
}
