import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  OTHER_WORK_COVER_LIGHTBOX_INNER,
  OTHER_WORKS_COVER_URLS,
  OTHER_WORKS_FAN as F,
  otherWorksCoverIsVideoUrl,
  otherWorksFanMaxPanels,
  otherWorksFanPanelImgIndices,
} from "./otherWorksCovers";
import { useViewportDesignScale } from "./ViewportScaleContext";

/** 与 {@link CaseDetailFloatingBack} 相同设计坐标，再乘视口 scale */
const LIGHTBOX_NAV_INSET_DESIGN_PX = 50;
const LIGHTBOX_NAV_SIZE_DESIGN_PX = 80;
/** 灯箱容器 `p-6` 左右 padding 之和 */
const LIGHTBOX_MODAL_PAD_X_PX = 48;
/** 预览图与左右导航按钮之间的最小间距（px） */
const LIGHTBOX_IMG_NAV_GAP_MIN_PX = 30;

/** 与 {@link CaseDetailFloatingBack} 一致：黄底 + 小圆角/一角大圆角，内嵌图标区域 22.5% inset */
function LightboxNavChevronButton({
  side,
  "aria-label": ariaLabel,
  onClick,
}: {
  side: "prev" | "next";
  "aria-label": string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const s = useViewportDesignScale();
  const size = LIGHTBOX_NAV_SIZE_DESIGN_PX * s;
  const rS = 4 * s;
  const rL = 16 * s;
  const isPrev = side === "prev";
  /** 内页返回：小圆角三处 + 右下大圆角；上一张为水平镜像（左下大圆角） */
  const borderTopLeftRadius = rS;
  const borderTopRightRadius = rS;
  const borderBottomLeftRadius = isPrev ? rL : rS;
  const borderBottomRightRadius = isPrev ? rS : rL;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="pointer-events-auto absolute top-1/2 z-[2] -translate-y-1/2 bg-[#d4ff5b] p-0 outline-none ring-offset-2 ring-offset-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-white"
      style={{
        width: size,
        height: size,
        left: isPrev ? LIGHTBOX_NAV_INSET_DESIGN_PX * s : undefined,
        right: isPrev ? undefined : LIGHTBOX_NAV_INSET_DESIGN_PX * s,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
      }}
    >
      <span className="absolute inset-[22.5%] block text-[#0a0a0a]" aria-hidden>
        {isPrev ? (
          <svg className="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6l-6 6 6 6" />
          </svg>
        ) : (
          <svg className="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6l6 6-6 6" />
          </svg>
        )}
      </span>
    </button>
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.window !== "undefined" &&
    globalThis.window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 灯箱内单段视频：限制高度，竖屏不超出视口（内页图片不设 max-h，仅宽度限制） */
const LIGHTBOX_INNER_VIDEO_CLASSES =
  "max-h-[min(85vh,900px)] max-w-full w-auto h-auto object-contain";
const LIGHTBOX_INNER_IMAGE_CLASSES = "max-w-full w-auto h-auto";

/** 封面 / 灯箱：支持 `cover.png` 或 `cover.mp4` 等（由 URL 扩展名判断） */
function OtherWorksCoverMedia({
  src,
  variant,
  innerRoundingClass,
  innerOmitShadow,
}: {
  src: string;
  variant: "fan-card" | "lightbox-hero" | "lightbox-inner";
  /** 仅 `lightbox-inner`：圆角类，多张竖条时传 `rounded-none` */
  innerRoundingClass?: string;
  /** 仅 `lightbox-inner`：外层已包阴影时设为 true */
  innerOmitShadow?: boolean;
}) {
  const innerR = innerRoundingClass ?? "rounded-lg";
  const innerSh = innerOmitShadow
    ? ""
    : "shadow-[0_16px_48px_rgba(0,0,0,0.5)]";
  if (otherWorksCoverIsVideoUrl(src)) {
    if (variant === "fan-card") {
      return (
        <video
          src={src}
          className="pointer-events-none h-full w-full object-cover outline-none ring-0"
          autoPlay={!prefersReducedMotion()}
          muted
          loop={!prefersReducedMotion()}
          playsInline
          aria-hidden
        />
      );
    }
    if (variant === "lightbox-hero") {
      return (
        <video
          src={src}
          className="max-h-[min(85vh,900px)] w-auto max-w-full rounded-lg object-contain shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          controls
          playsInline
          muted
          loop
        />
      );
    }
    return (
      <video
        src={src}
        className={[
          "ow-lightbox-inner-img mx-auto block",
          LIGHTBOX_INNER_VIDEO_CLASSES,
          innerR,
          innerSh || undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        controls
        playsInline
        muted
        loop
      />
    );
  }
  if (variant === "fan-card") {
    return (
      <img
        alt=""
        src={src}
        draggable={false}
        className="pointer-events-none h-full w-full object-cover outline-none"
      />
    );
  }
  if (variant === "lightbox-hero") {
    return (
      <img
        alt=""
        src={src}
        className="max-h-[min(85vh,900px)] w-auto max-w-full rounded-lg object-contain shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      />
    );
  }
  return (
    <img
      alt=""
      src={src}
      decoding="sync"
      fetchPriority="high"
      sizes="(max-width: 1920px) 100vw, 1440px"
      className={[
        "ow-lightbox-inner-img mx-auto block",
        LIGHTBOX_INNER_IMAGE_CLASSES,
        innerR,
        innerSh || undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

type OwFanCardProps = {
  angle: number;
  arcRadius: number;
  cardW: number;
  cardH: number;
  src: string;
  /** 无障碍 */
  openAriaLabel: string;
  onOpen: () => void;
};

function OwFanCard({
  angle,
  arcRadius,
  cardW,
  cardH,
  src,
  openAriaLabel,
  onOpen,
}: OwFanCardProps) {
  const [tilt, setTilt] = useState({ on: false, rx: 0, ry: 0, tz: 0 });

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const maxT = 10;
    const ry = nx * maxT;
    const rx = -ny * maxT;
    const d = Math.min(1, Math.hypot(nx, ny) / 1.42);
    const tz = 14 + (1 - d) * 44;
    setTilt({ on: true, rx, ry, tz });
  };

  const clearTilt = () => setTilt({ on: false, rx: 0, ry: 0, tz: 0 });

  const focusLift = () =>
    prefersReducedMotion()
      ? { on: true as const, rx: 0, ry: 0, tz: 10 }
      : { on: true as const, rx: 0, ry: 0, tz: 50 };

  const reduced = prefersReducedMotion();
  const floatTransform = tilt.on
    ? reduced
      ? "translate3d(0,-4px,10px) scale(1.03)"
      : `perspective(920px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(0,-10px,${tilt.tz}px) scale(1.06)`
    : "translate3d(0,0,0)";

  const floatShadow = tilt.on
    ? "0 32px 64px rgba(0,0,0,0.62)"
    : "0 18px 44px rgba(0,0,0,0.55)";

  const floatTransition = tilt.on
    ? "transform 0.08s ease-out, box-shadow 0.2s ease"
    : "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease";

  return (
    <figure
      className="ow-fan-panel pointer-events-auto absolute left-0 top-0 m-0 overflow-visible border-0 p-0"
      style={
        {
          width: cardW,
          height: cardH,
          marginLeft: -cardW / 2,
          marginTop: -cardH / 2,
          transform: `rotate(${angle}deg) translateY(-${arcRadius}px)`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          zIndex: tilt.on ? 40 : undefined,
        } as CSSProperties
      }
    >
      {/* 变换在外层：避免 button 的 overflow-hidden 把 scale / translateZ 裁在卡片内 */}
      <div
        className="ow-fan-float-wrap h-full w-full overflow-visible [transform-style:preserve-3d]"
        style={
          {
            transform: floatTransform,
            boxShadow: floatShadow,
            transition: floatTransition,
          } as CSSProperties
        }
      >
        <button
          type="button"
          className="block h-full w-full cursor-pointer overflow-hidden rounded-[6px] border-0 bg-transparent p-0 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          aria-label={openAriaLabel}
          onClick={onOpen}
          onMouseMove={handleMove}
          onMouseLeave={clearTilt}
          onMouseEnter={(e) => {
            if (prefersReducedMotion()) setTilt(focusLift());
            else handleMove(e);
          }}
          onFocus={() => setTilt(focusLift())}
          onBlur={clearTilt}
        >
          <OtherWorksCoverMedia src={src} variant="fan-card" />
        </button>
      </div>
    </figure>
  );
}

export function OtherWorksStackSection() {
  const uid = useId().replace(/:/g, "");
  const n = OTHER_WORKS_COVER_URLS.length;
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const maxByGeometry = otherWorksFanMaxPanels(
    F.cardW,
    F.arcRadius,
    F.panelChordGapFactor,
  );
  const basePanelCount = Math.max(
    F.panelCountMin,
    Math.min(F.panelCountMax, maxByGeometry),
  );
  /** 移动端降低同屏合成负载，避免快速滑动时浏览器触发整页重载 */
  const panelCount = isCoarsePointer
    ? Math.max(F.panelCountMin, Math.min(10, basePanelCount))
    : basePanelCount;
  const angleStep = 360 / panelCount;

  const fanPanelImgIdx = useMemo(
    () => otherWorksFanPanelImgIndices(panelCount, n),
    [panelCount, n],
  );

  const animName = `owFan${uid}`;
  const rotorClass = `ow-fan-rotor-${uid}`;

  const keyframesCss = useMemo(
    () => {
      const a0 = F.initialAnimOffsetDeg;
      const a1 = F.initialAnimOffsetDeg - 360;
      const disableRotorAnimation = isCoarsePointer;
      return `
@keyframes ${animName} {
  from { transform: rotate(${a0}deg); }
  to { transform: rotate(${a1}deg); }
}
.${rotorClass} {
  transform-origin: center center;
  transform: rotate(${a0}deg);
  animation: ${disableRotorAnimation ? "none" : `${animName} ${F.loopMs}ms linear infinite`};
  will-change: transform;
}
${disableRotorAnimation ? "" : `
.ow-fan-stage:has(.ow-fan-panel:hover) .${rotorClass},
.ow-fan-stage:has(.ow-fan-panel:focus-within) .${rotorClass} {
  animation-play-state: paused;
}
`}
@media (prefers-reduced-motion: reduce) {
  .${rotorClass} {
    animation: none !important;
    transform: rotate(${a0}deg) !important;
  }
}
`;
    },
    [animName, rotorClass, uid, F.loopMs, F.initialAnimOffsetDeg, isCoarsePointer],
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const viewportScale = useViewportDesignScale();
  /**
   * 灯箱内容区最大宽度（封面 / 内页同一套）：
   * `p-6` + 左右各「导航按钮占位 + 与图 30px 间距」，上限 1440。
   */
  const lightboxContentMaxW = useMemo(() => {
    const cw =
      typeof document !== "undefined"
        ? document.documentElement.clientWidth
        : 1920;
    const sideReserve =
      LIGHTBOX_NAV_INSET_DESIGN_PX * viewportScale +
      LIGHTBOX_NAV_SIZE_DESIGN_PX * viewportScale +
      LIGHTBOX_IMG_NAV_GAP_MIN_PX;
    const raw = Math.min(
      1440,
      cw - LIGHTBOX_MODAL_PAD_X_PX - 2 * sideReserve,
    );
    return Math.max(96, Math.floor(raw));
  }, [viewportScale]);

  const openAt = useCallback((i: number) => {
    setLightboxIndex(((i % n) + n) % n);
  }, [n]);

  const close = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((cur) =>
      cur == null ? cur : (cur - 1 + n) % n,
    );
  }, [n]);

  const goNext = useCallback(() => {
    setLightboxIndex((cur) =>
      cur == null ? cur : (cur + 1) % n,
    );
  }, [n]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, goPrev, goNext]);

  const lightboxInner =
    lightboxIndex != null
      ? (OTHER_WORK_COVER_LIGHTBOX_INNER[lightboxIndex] ?? [])
      : [];

  const lightbox =
    lightboxIndex != null
      ? createPortal(
          <div
            className="fixed inset-0 z-[520]"
            role="dialog"
            aria-modal="true"
            aria-label="作品预览"
          >
            <button
              type="button"
              className="absolute inset-0 z-0 cursor-default border-0 bg-black/65 backdrop-blur-sm"
              aria-label="关闭预览"
              onClick={close}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-6">
              <LightboxNavChevronButton
              side="prev"
              aria-label="上一张"
              onClick={() => {
                goPrev();
              }}
            />
              <LightboxNavChevronButton
              side="next"
              aria-label="下一张"
              onClick={() => {
                goNext();
              }}
            />
              <button
              type="button"
              className="pointer-events-auto absolute right-4 top-4 z-[2] flex size-10 shrink-0 items-center justify-center rounded-[4px] border border-white/20 bg-[#0a0a0a]/90 text-white outline-none hover:border-[#d4ff5b] hover:text-[#d4ff5b] focus-visible:ring-2 focus-visible:ring-[#d4ff5b]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              aria-label="关闭"
              onClick={close}
            >
              <svg
                className="size-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
              <div
              className="ow-lightbox-scroll pointer-events-auto relative z-[1] mx-auto inline-flex max-h-[min(92vh,980px)] min-w-0 max-w-full flex-col items-center overflow-y-auto overflow-x-hidden overscroll-y-contain"
              style={{
                maxWidth: lightboxContentMaxW,
              }}
            >
              <div className="flex min-w-0 max-w-full flex-col items-center py-1">
                {lightboxInner.length === 0 ? (
                  <OtherWorksCoverMedia
                    src={OTHER_WORKS_COVER_URLS[lightboxIndex]}
                    variant="lightbox-hero"
                  />
                ) : lightboxInner.length === 1 ? (
                  <OtherWorksCoverMedia
                    key={lightboxInner[0]}
                    src={lightboxInner[0]}
                    variant="lightbox-inner"
                  />
                ) : (
                  <div className="w-full overflow-hidden rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                    {lightboxInner.map((innerSrc, i) => (
                      <OtherWorksCoverMedia
                        key={`${i}-${innerSrc}`}
                        src={innerSrc}
                        variant="lightbox-inner"
                        innerRoundingClass="rounded-none"
                        innerOmitShadow
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframesCss }} />
      <div
        className="ow-fan-viewport -translate-x-1/2 absolute left-[calc(50%+0.5px)] top-[400px] h-[715.154px] w-[2379px] overflow-visible"
        data-node-id="1167:448"
      >
        <div className="ow-fan-stage relative h-full w-full overflow-visible">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
          <div className="relative z-[1] h-full w-full overflow-visible">
            <div
              className={`${rotorClass} pointer-events-auto absolute left-1/2 w-0 -translate-x-1/2`}
              style={{
                top: F.fanCenterY,
                height: 0,
              }}
            >
              {Array.from({ length: panelCount }, (_, k) => {
                const angle = k * angleStep;
                const imgIdx = fanPanelImgIdx[k] ?? k % n;
                const src = OTHER_WORKS_COVER_URLS[imgIdx];
                return (
                  <OwFanCard
                    key={k}
                    angle={angle}
                    arcRadius={F.arcRadius}
                    cardW={F.cardW}
                    cardH={F.cardH}
                    src={src}
                    openAriaLabel={`查看其他项目封面 ${imgIdx + 1}`}
                    onOpen={() => openAt(imgIdx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {lightbox}
    </>
  );
}
