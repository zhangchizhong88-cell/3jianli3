import { useMemo, type CSSProperties } from "react";

const FLAKE_COUNT = 240;

export function ProjectsSnowfall() {
  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKE_COUNT }, (_, i) => {
        const seed = i * 7919 + 17;
        const left = ((seed * 13) % 10000) / 100;
        const duration = 14 + ((seed % 7000) / 1000) * 6;
        const delay = -((seed % 28000) / 1000);
        /* 设计稿坐标下 2–3px；缩放后仍明显 */
        const size = 2 + (i % 2);
        const drift = ((seed % 220) - 110) / 7;
        const opacity = 0.32 + ((seed % 55) / 200);
        return { left, duration, delay, size, drift, opacity };
      }),
    [],
  );

  return (
    <div
      className="projects-snowfall pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {flakes.map((f, i) => (
        <span
          key={i}
          className="projects-snowfall-flake absolute rounded-full bg-white"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--snow-drift": `${f.drift}px`,
              "--snow-op-static": String(Math.min(0.55, f.opacity + 0.06)),
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
