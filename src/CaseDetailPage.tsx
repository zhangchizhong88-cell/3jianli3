import { useEffect, useLayoutEffect, useRef } from "react";
import { CaseDetailFloatingBack } from "./CaseDetailFloatingBack";
import { ScaledViewport } from "./ScaledViewport";
import {
  CASE_CONFIG,
  CASE_DETAIL_NAV,
  type CaseSlug,
} from "./caseStudy";

/** Figma 内页 1169:610 顶栏与返回图标（MCP asset，与简历区资源一致） */
const imgCaseDetailUnion =
  "/figma-assets/7130f930-3db3-4c0c-80e3-997384ee12f6.svg";
const imgCaseDetailEllipse =
  "/figma-assets/7a32ab40-e3e3-48e0-9b4c-62e555db4a5a.svg";
type CaseDetailPageProps = {
  slug: CaseSlug;
  onClose: () => void;
};

export function CaseDetailPage({ slug, onClose }: CaseDetailPageProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const { images } = CASE_CONFIG[slug];
  const nav = CASE_DETAIL_NAV[slug];

  /** 叠在简历之上时锁住 body，避免带动 window 滚动，返回后仍停留在外页原位置 */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /** 内页自己在 fixed 容器内滚动；切换 slug 时滚回该容器顶部 */
  useLayoutEffect(() => {
    const el = scrollRootRef.current;
    if (el) el.scrollTop = 0;
  }, [slug]);

  return (
    <div
      ref={scrollRootRef}
      className="fixed inset-0 z-[260] overflow-y-auto overflow-x-clip bg-[#0a0a0a]"
    >
      <CaseDetailFloatingBack onClose={onClose} />
      <ScaledViewport>
        <div
          className="relative w-[1920px] shrink-0 bg-[#0a0a0a] text-white"
          data-node-id="1169:610"
          data-name="内页"
        >
          <div
            className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-[180px] not-italic text-[100px] text-[rgba(255,255,255,0.7)] top-[234px] w-[1106px]"
            data-node-id="1169:611"
          >
            <p className="leading-[100px] whitespace-pre-wrap">
              {nav.heroMonumentText}
            </p>
          </div>

          <div
            className="absolute h-[64px] left-[20px] top-[20px] w-[1880px]"
            data-node-id="1169:613"
            data-name="页眉"
          >
            <div
              className="absolute h-[21px] left-0 top-0 w-[1880px]"
              data-node-id="1169:614"
              data-name="Union"
            >
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgCaseDetailUnion}
              />
            </div>
            <div
              className="absolute content-stretch flex gap-[20px] items-center left-0 top-[40px]"
              data-node-id="1169:619"
            >
              <div className="relative shrink-0 size-[4px]" data-node-id="1169:620">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgCaseDetailEllipse}
                />
              </div>
              <div
                className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap"
                data-node-id="1169:621"
              >
                <p className="leading-[23.4px]">{nav.indexLabel}</p>
              </div>
            </div>
            <div
              className="absolute content-stretch flex gap-[20px] items-center left-[550px] top-[40px]"
              data-node-id="1169:622"
            >
              <div className="relative shrink-0 size-[4px]" data-node-id="1169:623">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgCaseDetailEllipse}
                />
              </div>
              <div
                className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap"
                data-node-id="1169:624"
              >
                <p className="leading-[23.4px]">{nav.centerLabel}</p>
              </div>
            </div>
            <div
              className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap"
              data-node-id="1169:625"
            >
              <p className="leading-[23.4px]">{nav.rightTag}</p>
            </div>
          </div>

          <div
            className="relative left-[240px] w-[1440px] pt-[414px] leading-[0]"
            data-name="image-stream"
          >
            <div className="flex flex-col gap-0">
              {images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  decoding="async"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="m-0 block h-auto w-full max-w-full align-top p-0"
                />
              ))}
            </div>
          </div>
        </div>
      </ScaledViewport>
    </div>
  );
}
