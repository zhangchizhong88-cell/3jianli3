import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** 传给 IntersectionObserver，与原先整段进入视口时机的节奏接近 */
  rootMargin?: string;
  threshold?: number | number[];
};

function isElementInViewport(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  const h = globalThis.window.visualViewport?.height ?? globalThis.window.innerHeight;
  const w = globalThis.window.visualViewport?.width ?? globalThis.window.innerWidth;
  return r.bottom > 0 && r.top < h && r.right > 0 && r.left < w;
}

/**
 * 淡入 + 自右向左滑入；**每条单独**在进入视口时触发，无衔接错时。
 */
export function RevealStaggerInner({
  children,
  className = "",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.07,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isElementInViewport(el)) setRevealed(true);
    const id = requestAnimationFrame(() => {
      if (ref.current && isElementInViewport(ref.current)) setRevealed(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const ob = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            ob.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin, threshold },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [revealed, rootMargin, threshold]);

  useEffect(() => {
    if (revealed) return;
    const el = ref.current;
    if (!el) return;
    const onScrollOrResize = () => {
      if (isElementInViewport(el)) setRevealed(true);
    };
    onScrollOrResize();
    globalThis.window.addEventListener("scroll", onScrollOrResize, { passive: true });
    globalThis.window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      globalThis.window.removeEventListener("scroll", onScrollOrResize);
      globalThis.window.removeEventListener("resize", onScrollOrResize);
    };
  }, [revealed]);

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-[2720ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:duration-0 motion-reduce:delay-0 ${
        revealed ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
