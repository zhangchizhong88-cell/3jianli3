import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { startHeroMuxPreload } from "./warmHeroMuxPreload";

const SPLASH_IMG = "/splash-loading-mark.png";
const HERO_LOOP_MP4 = "/videos/hero-loop.mp4";
/** 至少展示时长，避免 `load` 过快时看不到动效 */
const MIN_VISIBLE_MS = 1100;
/**
 * 进度条在 92% 等待 `window` 的 `load`（整页含图片/视频等子资源就绪）。
 * 内嵌预览或某个外链长期 pending 时 `load` 可能永不触发，故设硬超时避免卡死。
 */
const LOAD_FALLBACK_MS = 12_000;

/**
 * 首屏加载：全屏遮罩 + 品牌图（透明底）XYZ 旋转 + `Loading...xx%`（`window.load` 或超时后淡出）。
 * 挂载时预热头图 Mux HLS 与左侧循环 MP4，减轻进入首页后的等待。
 * Portal 到 `body`，保证叠在 {@link StickyHeroBrand} / {@link StickyHeroMenu}（z-200）之上。
 */
export function LoadingSplash() {
  const [mounted, setMounted] = useState(false);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const startRef = useRef(0);

  useLayoutEffect(() => {
    startRef.current = performance.now();
    setMounted(true);
  }, []);

  /** 遮罩存在期间预热头图资源；`gone` 后 teardown，避免与正式 video 长期双开 */
  useEffect(() => {
    if (gone) return;
    const stopMux = startHeroMuxPreload();
    const warmImg = new Image();
    warmImg.src = SPLASH_IMG;
    const linkMp4 = document.createElement("link");
    linkMp4.rel = "preload";
    linkMp4.as = "video";
    linkMp4.href = HERO_LOOP_MP4;
    document.head.appendChild(linkMp4);
    return () => {
      stopMux();
      linkMp4.remove();
    };
  }, [gone]);

  useEffect(() => {
    if (!mounted) return;

    let tick = 0;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(tick);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      setPct(100);
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startRef.current));
      window.setTimeout(() => setExiting(true), wait);
    };

    tick = window.setInterval(() => {
      setPct((p) => (p >= 92 ? 92 : Math.min(92, p + 2 + Math.floor(Math.random() * 4))));
    }, 140);

    fallbackTimer = window.setTimeout(finish, LOAD_FALLBACK_MS);

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      finished = true;
      window.clearInterval(tick);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      window.removeEventListener("load", finish);
    };
  }, [mounted]);

  if (!mounted || gone) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[500] flex flex-col bg-[#0a0a0a] transition-opacity duration-1000 ease-out ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label="页面加载中"
      onTransitionEnd={(e) => {
        if (e.propertyName === "opacity" && exiting) setGone(true);
      }}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="loading-splash-scene flex flex-1 flex-col items-center justify-center px-6">
          <div className="loading-splash-spin flex size-[min(90px,23vw)] items-center justify-center">
            <img
              src={SPLASH_IMG}
              alt=""
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
        <div className="w-full shrink-0 px-8 pb-10 pt-2 sm:px-12 sm:pb-14">
          <div
            className="mx-auto w-full max-w-[min(420px,88vw)] overflow-hidden rounded-none bg-[rgba(255,255,255,0.08)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`加载进度 ${pct}%`}
          >
            <div
              className="h-[4px] rounded-none bg-[#d4ff5b] transition-[width] duration-400 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-4 text-center font-monument text-[13px] tracking-[0.2em] text-white/90 sm:text-[15px]">
            Loading...{pct}%
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
