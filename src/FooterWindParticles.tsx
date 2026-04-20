import { useMemo, type CSSProperties } from "react";

const PARTICLE_COUNT = 160;

type Dust = {
  topPct: number;
  leftStart: number;
  duration: number;
  delay: number;
  w: number;
  h: number;
  opacity: number;
  y25: number;
  y50: number;
  y75: number;
  y100: number;
  opStatic: number;
};

export function FooterWindParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i): Dust => {
      const seed = i * 6841 + 29;
      const topPct = ((seed * 11) % 10000) / 100;
      const leftStart = -60 - (seed % 120);
      const duration = 9 + ((seed % 8000) / 1000) * 10;
      const delay = -((seed % 22000) / 1000);
      const streak = seed % 5 === 0;
      const w = streak ? 2 + (i % 3) : 1 + (i % 2);
      const h = streak ? 1 : 2 + (i % 2);
      const opacity = 0.22 + ((seed % 50) / 180);
      const amp = 4 + (seed % 18);
      const y25 = ((seed % 17) - 8) * 0.4;
      const y50 = ((seed % 23) - 11) * (amp / 11);
      const y75 = ((seed % 19) - 9) * 0.35;
      const y100 = ((seed % 13) - 6) * 0.25;
      const opStatic = Math.min(0.5, opacity + 0.08);
      return {
        topPct,
        leftStart,
        duration,
        delay,
        w,
        h,
        opacity,
        y25,
        y50,
        y75,
        y100,
        opStatic,
      };
    });
  }, []);

  return (
    <div
      className="footer-wind-particles pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="footer-wind-particle absolute rounded-full bg-white"
          style={
            {
              top: `${p.topPct}%`,
              left: `${p.leftStart}px`,
              width: p.w,
              height: p.h,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--dust-op": String(p.opacity),
              "--dust-op-static": String(p.opStatic),
              "--wy25": `${p.y25}px`,
              "--wy50": `${p.y50}px`,
              "--wy75": `${p.y75}px`,
              "--wy100": `${p.y100}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
