import { useEffect, useRef, useState } from "react";

export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, on] as const;
}

export function motionOk() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Glide toward a target. Jumps if the reader asked for less motion. */
export function useEase(target: number, ms = 800) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    if (!motionOk()) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const from = valueRef.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const u = Math.min(1, (now - t0) / ms);
      const e = 1 - (1 - u) * (1 - u);
      const v = from + (target - from) * e;
      valueRef.current = v;
      setValue(v);
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}
