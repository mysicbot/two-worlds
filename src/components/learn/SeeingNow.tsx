import { useEffect, useState } from "react";

const STEPS = [
  {
    kicker: "1 · Listen",
    title: "Satellites, not a picture",
    body: "A phone does not look up a map to find you. It listens for signals from satellites and measures how long they took to arrive. That gives distances. Distances give a place.",
  },
  {
    kicker: "2 · Name",
    title: "Two numbers on a smooth egg",
    body: "Those distances are turned into a latitude and a longitude on WGS84, the smooth egg GPS agreed to use. The number is not the rock. It is a name for the rock, on a model.",
  },
  {
    kicker: "3 · Draw",
    title: "Then someone picks a projection",
    body: "The map app draws that point with Web Mercator, because square tiles are easy to stack. Greenland looks huge. That is the drawing, not the satellite, and not the egg.",
  },
];

export function SeeingNow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((n) => (n + 1) % STEPS.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-3">
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
  );
}
