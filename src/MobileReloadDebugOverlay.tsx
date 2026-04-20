import { useEffect, useMemo, useState } from "react";

function nowLabel() {
  const d = new Date();
  return d.toLocaleTimeString("zh-CN", { hour12: false });
}

function navTypeLabel() {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type ?? "unknown";
}

/**
 * 临时调试面板：用于定位移动端“滑动后疑似重载”问题。
 * 仅在 URL 含 `debugReload=1` 时挂载。
 */
export function MobileReloadDebugOverlay() {
  const enabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search);
    return p.get("debugReload") === "1";
  }, []);

  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const push = (msg: string) => {
      setLogs((prev) => {
        const next = [`${nowLabel()} ${msg}`, ...prev];
        return next.slice(0, 16);
      });
    };

    push(`overlay mounted nav=${navTypeLabel()}`);
    push(`ua=${navigator.userAgent.slice(0, 80)}...`);

    const onPageShow = (e: PageTransitionEvent) =>
      push(`pageshow persisted=${String(e.persisted)}`);
    const onPageHide = (e: PageTransitionEvent) =>
      push(`pagehide persisted=${String(e.persisted)}`);
    const onVisibility = () => push(`visibility=${document.visibilityState}`);
    const onResize = () =>
      push(
        `resize w=${document.documentElement.clientWidth} h=${window.innerHeight}`,
      );
    const onOrientation = () =>
      push(`orientation=${screen.orientation?.type ?? "unknown"}`);
    const onError = (e: ErrorEvent) =>
      push(`error ${e.message || "unknown"} @${e.filename || "inline"}`);
    const onRejection = (e: PromiseRejectionEvent) =>
      push(`unhandledrejection ${String(e.reason).slice(0, 80)}`);

    let lastScrollTs = 0;
    const onScroll = () => {
      const t = Date.now();
      if (t - lastScrollTs < 600) return;
      lastScrollTs = t;
      push(`scrollY=${Math.round(window.scrollY)}`);
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-2 left-2 z-[9999] max-w-[92vw] rounded-md border border-white/25 bg-black/80 p-2 text-[11px] text-lime-300 backdrop-blur-sm">
      <div className="mb-1 font-mono text-white/90">debugReload=1</div>
      <div className="max-h-[38vh] overflow-auto font-mono leading-[1.35]">
        {logs.map((line, i) => (
          <div key={`${i}-${line}`} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

