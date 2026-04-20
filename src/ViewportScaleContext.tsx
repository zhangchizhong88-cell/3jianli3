import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

const DESIGN_WIDTH = 1920;

const ViewportScaleContext = createContext(1);

export function useViewportDesignScale() {
  return useContext(ViewportScaleContext);
}

/**
 * 与 {@link ScaledViewport} 使用同一套 `innerWidth / 1920`，供浮层组件对齐设计坐标。
 */
export function ViewportScaleProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.clientWidth / DESIGN_WIDTH
      : 1,
  );

  useLayoutEffect(() => {
    const update = () =>
      setScale(document.documentElement.clientWidth / DESIGN_WIDTH);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <ViewportScaleContext.Provider value={scale}>
      {children}
    </ViewportScaleContext.Provider>
  );
}
