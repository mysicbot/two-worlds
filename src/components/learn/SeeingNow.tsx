import { useEffect, useState } from "react";
import { motionOk, useOnScreen } from "./hooks";

const STEPS = [
  {
    kicker: "1 · Listen",
    title: "Satellites, not a picture",
    body: "The phone does not look at a map to find you. It listens for signals and times them. Time tells it the distance. A few distances tell it the place.",
  },
  {
    kicker: "2 · Write a name",
    title: "Two numbers on the smooth egg",
    body: "Those distances become a latitude and a longitude. The egg they use is called WGS84. The number is a name for the rock. It is not a photo of the rock.",
  },
  {
    kicker: "3 · Draw",
    title: "Then the app picks a picture",
    body: "The map cuts the world into square tiles. That picture stretches the north. Greenland looks huge. The satellites did not say that. The drawing did.",
  },
];

function ChainPicture({ step, angle }: { step: number; angle: number }) {
  const tiles = [];
  let y = 36;
  for (let row = 0; row < 4; row += 1) {
    const h = row === 0 ? 34 : 18;
    for (let col = 0; col < 4; col += 1) {
      const north = row === 0 && col === 2;
      tiles.push(
        <rect
          key={`${row}-${col}`}
          x={176 + col * 40}
          y={y}
          width="36"
          height={h - 3}
          rx="1.5"
          className={north ? "fill-highlight" : "fill-land"}
          opacity={north ? 0.95 : 0.8}
        />,
      );
    }
    y += h;
  }

  return (
    <svg viewBox="0 0 360 180" className="h-auto w-full" aria-hidden>
      <circle cx="78" cy="86" r="36" className="fill-ocean" />
      <ellipse cx="78" cy="86" rx="36" ry="11" fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="78" cy="86" rx="14" ry="36" fill="none" className="text-border" stroke="currentColor" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => {
        const a = angle + (i * Math.PI) / 2;
        const x = 78 + Math.cos(a) * 58;
        const ySat = 86 + Math.sin(a) * 22;
        return (
          <g key={i} opacity={step === 0 ? 1 : 0.2}>
            <circle cx={x} cy={ySat} r="3.2" className="fill-highlight" />
          </g>
        );
      })}
      <g opacity={step === 0 ? 1 : 0}>
        <rect x="18" y="142" width="16" height="26" rx="2" fill="none" className="text-fg" stroke="currentColor" strokeWidth="1.3" />
        <text x="44" y="160" className="fill-muted text-[11px]">
          timing the signals
        </text>
      </g>
      <g opacity={step === 1 ? 1 : 0}>
        <text x="168" y="78" className="fill-fg font-display text-[28px]">
          43.7° N
        </text>
        <text x="168" y="112" className="fill-fg font-display text-[28px]">
          79.4° W
        </text>
        <text x="168" y="136" className="fill-subtle text-[11px]">
          Toronto, written on the egg
        </text>
      </g>
      <g opacity={step === 2 ? 1 : 0}>
        {tiles}
        <text x="176" y="24" className="fill-subtle text-[11px]">
          square tiles · north row stretched
        </text>
      </g>
    </svg>
  );
}

export function SeeingNow() {
  const [ref, visible] = useOnScreen<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!visible || !motionOk()) return;
    const id = window.setInterval(() => setStep((n) => (n + 1) % STEPS.length), 4200);
    return () => window.clearInterval(id);
  }, [visible]);

  useEffect(() => {
    if (!visible || !motionOk()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setAngle(((now - t0) / 6000) * Math.PI * 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <div ref={ref}>
      <div className="rounded-lg border border-border bg-elevated p-3 sm:p-4">
        <ChainPicture step={step} angle={angle} />
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {STEPS.map((item, i) => {
          const on = i === step;
          return (
            <button
              key={item.kicker}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-md border p-4 text-left ${on ? "border-accent bg-elevated" : "border-border bg-surface"}`}
            >
              <p className={`font-mono text-[11px] tracking-[0.14em] uppercase ${on ? "text-accent" : "text-subtle"}`}>
                {item.kicker}
              </p>
              <h3 className="mt-2 font-display text-2xl text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
