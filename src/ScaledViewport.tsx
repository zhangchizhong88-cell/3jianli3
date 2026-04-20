import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useViewportDesignScale } from "./ViewportScaleContext";

const DESIGN_WIDTH = 1920;

/**
 * 将固定宽度为 {@link DESIGN_WIDTH}px 的子树整体等比缩放以适配视口宽度，
 * 不修改子组件内部任何布局类名或结构。
 * 缩放系数须由外层 {@link ViewportScaleProvider} 提供，与浮层对齐一致。
 */
export function ScaledViewport({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const scale = useViewportDesignScale();
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    let rafId = 0;
    const update = () => {
      const next = inner.scrollHeight;
      setContentHeight((prev) => (prev === next ? prev : next));
    };
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(inner);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [scale, children]);
  /** 向上取整，减轻 scale 后小数高度导致的亚像素缝（缝里会透出浅底，像多了一根灰线） */
  const wrapperHeight =
    contentHeight > 0 ? Math.ceil(contentHeight * scale - 1e-6) : undefined;

  return (
    <div className="w-full overflow-x-clip bg-transparent">
      <div
        className="relative mx-auto bg-transparent"
        style={{
          width: DESIGN_WIDTH * scale,
          height: wrapperHeight,
          minHeight: contentHeight === 0 ? "100vh" : undefined,
        }}
      >
        <div
          ref={innerRef}
          className="absolute left-0 top-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{
            width: DESIGN_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
