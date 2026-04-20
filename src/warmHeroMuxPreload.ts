import type HlsType from "hls.js";
import { MUX_HERO_HLS_URL } from "./muxHeroHlsUrl";

/**
 * 在首屏加载阶段后台缓冲头图 Mux 流，进入 {@link HeroMuxBackground} 后尽量命中 HTTP/媒体缓存。
 * 返回 teardown；应在遮罩淡出时调用，避免与正式 `<video>` 长期双开抢带宽。
 */
export function startHeroMuxPreload(): () => void {
  const video = document.createElement("video");
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.style.cssText =
    "position:fixed;left:0;top:0;width:4px;height:4px;opacity:0.01;pointer-events:none;z-index:-1";

  document.body.appendChild(video);

  let cancelled = false;
  let hls: HlsType | null = null;

  const canNativeHls =
    video.canPlayType("application/vnd.apple.mpegurl") !== "" ||
    video.canPlayType("application/x-mpegURL") !== "";

  if (canNativeHls) {
    video.src = MUX_HERO_HLS_URL;
    void video.play().catch(() => {});
  } else {
    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: false,
        });
        hls.loadSource(MUX_HERO_HLS_URL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled || !hls) return;
          const maxIdx = hls.levels.length - 1;
          if (maxIdx >= 0) hls.currentLevel = maxIdx;
          void video.play().catch(() => {});
        });
      } else {
        video.src = MUX_HERO_HLS_URL;
        void video.play().catch(() => {});
      }
    });
  }

  return () => {
    cancelled = true;
    hls?.destroy();
    hls = null;
    video.removeAttribute("src");
    video.load();
    video.remove();
  };
}
