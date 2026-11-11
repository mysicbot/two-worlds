import { useEffect, useState } from "react";
import { motionOk, useOnScreen } from "./hooks";

export function PhotoHalf() {
  const [ref, visible] = useOnScreen<HTMLElement>();
  const [angle, setAngle] = useState(0.4);

  useEffect(() => {
    if (!visible || !motionOk()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setAngle(((now - t0) / 5000) * Math.PI * 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const cx = 214;
  const cy = 104;
  const r = 58;
  const dx = cx - Math.cos(angle) * (r - 1);
  const dy = cy + Math.sin(angle) * (r - 1);
  const visibleFace = Math.cos(angle) > 0.08;

  return (
    <figure ref={ref} className="rounded-lg border border-border bg-elevated p-4 sm:p-5">
      <figcaption>
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">One photo, one face</p>
        <p className="mt-1 text-sm text-fg">
          {visibleFace ? "The city is on the near side. The camera can see it." : "The city rolled to the back. It is still there. It is just not in this photo."}
        </p>
      </figcaption>
      <svg viewBox="0 0 320 200" className="mt-2 h-auto w-full" role="img" aria-label="A camera looking at a ball. Only the near half is lit. A city dot rolls to the dark side.">
        <rect x="26" y="86" width="34" height="26" rx="3" fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="38" cy="99" r="6" fill="none" className="text-accent" stroke="currentColor" strokeWidth="1.3" />
        <path d="M60 92 L148 58" fill="none" className="text-border" stroke="currentColor" strokeWidth="1" />
        <path d="M60 112 L148 150" fill="none" className="text-border" stroke="currentColor" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r} className="fill-ocean" />
        <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`} className="fill-land" opacity="0.85" />
        <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} className="fill-bg" opacity="0.55" />
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} className="text-fg" stroke="currentColor" strokeWidth="1" />
        <circle cx={dx} cy={dy} r="5" className="fill-highlight" opacity={visibleFace ? 1 : 0.35} />
        <text x="70" y="188" className="fill-muted text-[11px]">
          camera
        </text>
        <text x={cx - 36} y="188" textAnchor="middle" className="fill-fg text-[11px]">
          in the photo
        </text>
        <text x={cx + 40} y="188" textAnchor="middle" className="fill-subtle text-[11px]">
          hidden
        </text>
      </svg>
      <p className="text-sm leading-relaxed text-muted">
        A picture from space is honest about the face it can see. It is not a map of the whole Earth. In the library
        this view is called orthographic. The word just means “looking straight on, from far away.”
      </p>
    </figure>
  );
}
