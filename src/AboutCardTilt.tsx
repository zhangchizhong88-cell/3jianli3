import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEventHandler,
  type ReactNode,
} from "react";

const easeOut = "cubic-bezier(0.23, 1, 0.32, 1)";

type AboutCardTiltProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
};

/**
 * About 区三卡片：指针相对中心位置驱动 rotateX / rotateY + 轻微 translateZ。
 * `prefers-reduced-motion` 下不应用 3D。
 */
export function AboutCardTilt({
  className,
  children,
  style: styleProp,
  ...rest
}: AboutCardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const apply = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el || reducedRef.current) return;
    const r = el.getBoundingClientRect();
    const px = (clientX - r.left) / r.width - 0.5;
    const py = (clientY - r.top) / r.height - 0.5;
    const maxRx = 5.5;
    const maxRy = 7.5;
    el.style.transform = `perspective(900px) rotateX(${-py * maxRx * 2}deg) rotateY(${px * maxRy * 2}deg) translateZ(10px)`;
  }, []);

  const onPointerEnter: PointerEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "none";
    apply(e.clientX, e.clientY);
  };

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    apply(e.clientX, e.clientY);
  };

  const onPointerLeave: PointerEventHandler<HTMLDivElement> = () => {
    const el = ref.current;
    if (!el) return;
    if (reducedRef.current) {
      el.style.transform = "";
      return;
    }
    el.style.transition = `transform 0.5s ${easeOut}`;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={ref}
      {...rest}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`about-card-tilt ${className ?? ""}`.trim()}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        ...styleProp,
      }}
    >
      {children}
    </div>
  );
}
