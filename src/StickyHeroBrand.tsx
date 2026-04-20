import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useViewportDesignScale } from "./ViewportScaleContext";

const SCROLL_RANGE = 200;
/** 展开态整块高度（CSS px）；滚满 {@link SCROLL_RANGE} 时缩到约 50px 高 */
const BASE_ROW_H = 96;
const SCALE_END = 50 / BASE_ROW_H;
const DESIGN_INSET = 50;
const DESIGN_WIDTH = 1920;

type Props = {
  logoSrc: string;
  /** 额外缩放系数（用于移动端压缩视觉尺寸） */
  scaleMultiplier?: number;
};

/**
 * 0–200px 滚动：`scale` 从 1 线性到 {@link SCALE_END}（整行高约 50px）。
 * Portal + fixed：画布在 {@link ScaledViewport} 内带 scale，顶栏需挂 body 才能相对视口固定。
 */
export function StickyHeroBrand({ logoSrc, scaleMultiplier = 1 }: Props) {
  const d = useViewportDesignScale();
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  const iw = document.documentElement.clientWidth;
  const leftPx = (iw - DESIGN_WIDTH * d) / 2 + DESIGN_INSET * d;
  const topPx = DESIGN_INSET * d;

  const p = Math.min(Math.max(scrollY / SCROLL_RANGE, 0), 1);
  const scale = (1 + (SCALE_END - 1) * p) * scaleMultiplier;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[200] origin-top-left"
      style={{
        left: leftPx,
        top: topPx,
        transform: `scale(${scale})`,
      }}
      aria-label="Cian Zhang Design"
    >
      <div className="flex h-[96px] w-[520px] items-center gap-8 text-white">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md">
          <img alt="" className="h-full w-full object-cover" src={logoSrc} />
        </div>
        <div className="font-monumentUltra text-[40px] leading-[0.92]">
          <p className="mb-0 whitespace-pre">{`Cian Zhang `}</p>
          <p className="whitespace-pre">Design</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
