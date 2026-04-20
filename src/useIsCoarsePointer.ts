import { useEffect, useState } from "react";

/**
 * 粗略判定移动触控设备（iPhone/Android 等）。
 * 用于在移动端关闭高负载视觉层，优先保证稳定性。
 */
export function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search);
    return p.get("forceMobile") === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("forceMobile") === "1") {
      setIsCoarse(true);
      return;
    }
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return isCoarse;
}

