import type HlsType from "hls.js";
import { useEffect, useRef } from "react";
import { MUX_HERO_HLS_URL } from "./muxHeroHlsUrl";

type Props = {
  className?: string;
  /** 默认与 {@link MUX_HERO_HLS_URL} 一致；其它区块可传入独立 Mux 流。 */
  hlsUrl?: string;
};

/**
 * Mux HLS 背景视频：Safari 原生 HLS；其它浏览器按需加载 hls.js。
 */
export function HeroMuxBackground({ className, hlsUrl = MUX_HERO_HLS_URL }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsType | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;

    let cancelled = false;

    const canNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") !== "" ||
      video.canPlayType("application/x-mpegURL") !== "";

    if (canNativeHls) {
      video.src = hlsUrl;
      if (visibleRef.current) void video.play().catch(() => {});
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !ref.current) return;
      const el = ref.current;
      if (Hls.isSupported()) {
        const instance = new Hls({
          enableWorker: true,
          /**
           * 画布在 `transform: scale` 内时，`capLevelToPlayerSize` 容易把「布局尺寸」判小，
           * ABR 反复掉到低保码率 → 画面间歇发糊。
           */
          capLevelToPlayerSize: false,
        });
        hlsRef.current = instance;
        instance.loadSource(hlsUrl);
        instance.attachMedia(el);
        instance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return;
          const maxIdx = instance.levels.length - 1;
          if (maxIdx >= 0) {
            instance.currentLevel = maxIdx;
          }
          if (visibleRef.current) void el.play().catch(() => {});
        });
      } else {
        el.src = hlsUrl;
        if (visibleRef.current) void el.play().catch(() => {});
      }
    });

    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [hlsUrl]);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        visibleRef.current = visible;
        if (visible) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
