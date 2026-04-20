import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { heroMenuMaskSrc } from "./FigmaResume";
import { useViewportDesignScale } from "./ViewportScaleContext";

/** 设计稿坐标：头图右上角 Menu（node 1136:443） */
const MENU_DESIGN_LEFT = 1752;
const MENU_DESIGN_TOP = 50;
const MENU_DESIGN_W = 118;
const MENU_DESIGN_H = 48;
/** 下拉卡片设计宽度（需 ≥ Menu 宽，便于右侧对齐且包住翻转面板） */
const PANEL_WRAP_DESIGN_W = 200;
const PANEL_DESIGN_W = 188;
const PANEL_GAP_DESIGN = 6;
/** 估算：三项导航 + padding（设计稿 px），与翻转容器裁剪高度一致 */
const PANEL_BODY_DESIGN_H = 132;
const STACK_DESIGN_H = MENU_DESIGN_H + PANEL_GAP_DESIGN + PANEL_BODY_DESIGN_H;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * 与 {@link StickyHeroBrand} 相同：按视口与 1920 画布对齐，Portal + fixed 保持悬浮。
 * Menu 点击展开导航卡片（绕右缘 Y 轴翻转）；鼠标离开菜单+卡片区域后自动收起。
 */
export function StickyHeroMenu() {
  const designScale = useViewportDesignScale();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  if (!mounted) return null;

  const iw = window.innerWidth;
  const d = designScale;
  const canvasLeft = (iw - 1920 * d) / 2;
  const menuLeftPx = canvasLeft + MENU_DESIGN_LEFT * d;
  const topPx = MENU_DESIGN_TOP * d;
  const clipW = MENU_DESIGN_W * d;
  const clipH = MENU_DESIGN_H * d;
  /** 包裹层右缘与 Menu 右缘对齐，向左加宽以覆盖下拉面板的悬停判定 */
  const wrapW = PANEL_WRAP_DESIGN_W * d;
  const wrapLeft = menuLeftPx + clipW - wrapW;

  return createPortal(
    <div
      className="fixed z-[200]"
      style={{
        left: wrapLeft,
        top: topPx,
        width: wrapW,
        height: open ? STACK_DESIGN_H * d : clipH,
        overflow: "visible",
      }}
    >
      <div
        className="origin-top-left"
        style={{
          width: PANEL_WRAP_DESIGN_W,
          transform: `scale(${d})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          className="relative"
          style={{
            width: PANEL_WRAP_DESIGN_W,
            height: open ? STACK_DESIGN_H : MENU_DESIGN_H,
          }}
          onMouseLeave={close}
        >
          <button
            type="button"
            className="-translate-y-1/2 absolute right-0 top-[24px] h-[48px] w-[118px] shrink-0 cursor-pointer rounded-[4px] border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls="hero-menu-panel"
            data-node-id="1136:444"
            data-name="Desktop Inactive"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-[48px] w-[118px] rounded-[4px] bg-[#0a0a0a]">
              <span
                className="-translate-y-1/2 absolute left-[16px] top-1/2 block h-[19px] w-[39.19px] overflow-clip"
                data-node-id="1136:445"
                data-name="Text Wrapper"
              >
                <span className="-translate-y-1/2 absolute left-[calc(50%-20.41px)] top-1/2 flex flex-col justify-center font-['Geist:Medium',sans-serif] text-[16px] font-medium leading-[0] tracking-[-0.64px] text-white whitespace-nowrap">
                  <span className="leading-[19.2px]">Menu</span>
                </span>
              </span>
              <span
                className="absolute bottom-[2px] left-[71.19px] top-[2px] w-[44px] overflow-clip rounded-[4px] bg-[#141414]"
                data-node-id="1136:447"
                data-name="Icon"
              >
                <span className="-translate-x-1/2 absolute bottom-[27.27%] left-1/2 top-[27.27%] w-[20px]">
                  <span
                    className="-translate-x-1/2 absolute bottom-0 left-1/2 top-0 aspect-[20/20] bg-[#d4ff5b] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[20px_20px]"
                    data-node-id="1136:453"
                    data-name="Background"
                    style={{ maskImage: `url('${heroMenuMaskSrc}')` }}
                  />
                </span>
              </span>
            </span>
          </button>

          <div
            className={`absolute right-0 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{
              top: MENU_DESIGN_H + PANEL_GAP_DESIGN,
              width: PANEL_DESIGN_W,
              perspective: 900,
            }}
          >
            <div
              id="hero-menu-panel"
              role="menu"
              aria-hidden={!open}
              className="rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
              style={{
                width: PANEL_DESIGN_W,
                transformOrigin: "100% 50%",
                transform: open
                  ? "rotateY(0deg) translateZ(0px)"
                  : "rotateY(90deg) translateZ(-48px)",
                opacity: open ? 1 : 0,
                transition:
                  "transform 0.38s cubic-bezier(0.22, 1, 0.32, 1), opacity 0.26s cubic-bezier(0.22, 1, 0.32, 1)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
            >
              <nav className="flex flex-col font-['Geist:Medium',sans-serif] text-[15px] font-medium tracking-[-0.6px]">
                <button
                  type="button"
                  role="menuitem"
                  className="w-full cursor-pointer border-0 bg-transparent py-2.5 text-left text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  onClick={() => {
                    scrollToSection("section-home");
                    close();
                  }}
                >
                  Home
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full cursor-pointer border-0 bg-transparent py-2.5 text-left text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  onClick={() => {
                    scrollToSection("section-projects");
                    close();
                  }}
                >
                  Projects
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full cursor-pointer border-0 bg-transparent py-2.5 text-left text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  onClick={() => {
                    scrollToSection("section-about");
                    close();
                  }}
                >
                  About
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
