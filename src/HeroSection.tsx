import { CopyToClipboard } from "./CopyToast";
import { HeroMuxBackground } from "./HeroMuxBackground";
import { useIsCoarsePointer } from "./useIsCoarsePointer";

const videoHeroLoop = "/videos/hero-loop.mp4";
const imgFrame =
  "/figma-assets/8b831903-dfc9-4c18-8dbf-73161ed106fe.svg";
const imgFrame1 =
  "/figma-assets/eba160f6-4cae-4873-9543-f6e71f0f815d.svg";
const imgFrame2 =
  "/figma-assets/7f99af77-4c57-4e3d-9283-51b373ce92a1.svg";
const imgUnion =
  "/figma-assets/b1b749d8-5678-48cd-b721-037039fe6398.svg";
const imgEllipse3 =
  "/figma-assets/4aeeea71-5a76-4f6e-88a0-50a2571fe37f.svg";

/** 头图画布（设计坐标 1920×1100），随页面在 {@link ScaledViewport} 内自然滚动；顶栏见 {@link StickyHeroBrand} / {@link StickyHeroMenu} */
export function HeroSection() {
  const isCoarsePointer = useIsCoarsePointer();
  return (
    <div
      id="section-home"
      className="relative h-[1100px] w-[1920px] scroll-mt-[80px] overflow-clip"
      data-node-id="1136:80"
      data-name="头图"
    >
      <div className="absolute h-[1100px] left-0 top-0 w-[1920px]" data-node-id="1136:81">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {!isCoarsePointer ? (
              <HeroMuxBackground className="pointer-events-none absolute inset-0 h-full w-full object-cover transform-gpu" />
            ) : (
              <div className="absolute inset-0 bg-[#0a0a0a]" />
            )}
          </div>
          <div className="absolute bg-gradient-to-b from-[rgba(10,10,10,0)] inset-0 to-[#0a0a0a]" />
        </div>
      </div>
      <div
        className="absolute bg-gradient-to-b from-[rgba(10,10,10,0)] h-[1100px] left-0 to-[#0a0a0a] top-0 w-[1920px]"
        data-node-id="1165:439"
      />
      <div className="absolute contents right-[50px] top-[686px]" data-node-id="1164:7">
        <div
          className="absolute h-[172px] right-[50px] top-[686px] w-[891px]"
          data-node-id="1136:82"
          data-name="Content Wrapper"
        >
          <div
            className="-translate-y-1/2 absolute h-[128px] left-0 right-0 top-[calc(50%-22px)]"
            data-node-id="1136:83"
            data-name="Text Wrapper"
          >
            <div
              className="-translate-y-1/2 absolute flex flex-col font-monument font-normal justify-center leading-[0] left-0 not-italic text-[36px] text-white top-[64px] w-[891px]"
              data-node-id="1136:85"
            >
              <p className="leading-[64px]">{`Professional UI/UX Design & Brand Presence`}</p>
            </div>
          </div>
          <div
            className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-px not-italic right-[572px] text-[20px] text-[rgba(255,255,255,0.7)] text-center top-[calc(50%+74px)] tracking-[-0.72px] whitespace-nowrap"
            data-node-id="1136:86"
          >
            <p className="leading-[23.4px]">2026 设计作品 | 以意设计，以见致远</p>
          </div>
        </div>
        <div className="absolute contents right-[526px] top-[898px]" data-node-id="1136:87">
          <CopyToClipboard
            text="18818390506"
            className="absolute bg-[#d4ff5b] content-stretch flex gap-[10px] items-center px-[20px] py-[16px] right-[772px] rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] top-[898px]"
            data-node-id="1136:88"
            data-name="Link - Primary Inverse"
          >
            <div
              className="content-stretch flex items-center overflow-clip relative shrink-0"
              data-node-id="1136:89"
              data-name="Icon L"
            >
              <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="1136:90" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
            </div>
            <div
              className="content-stretch flex items-center justify-center overflow-clip relative shrink-0"
              data-node-id="1136:96"
              data-name="Text Wrapper"
            >
              <div
                className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-black tracking-[-0.64px] whitespace-nowrap"
                data-node-id="1136:97"
              >
                <p className="leading-[19.2px]">18818390506</p>
              </div>
            </div>
          </CopyToClipboard>
          <CopyToClipboard
            text="362360825@qq.com"
            className="absolute border border-solid border-white content-stretch flex gap-[10px] items-center px-[20px] py-[16px] right-[526px] rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] top-[898px]"
            data-node-id="1136:98"
            data-name="Link - Primary Inverse"
          >
            <div
              className="content-stretch flex items-center overflow-clip relative shrink-0"
              data-node-id="1136:99"
              data-name="Icon L"
            >
              <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="1136:100" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
            </div>
            <div
              className="content-stretch flex items-center justify-center overflow-clip relative shrink-0"
              data-node-id="1136:103"
              data-name="Text Wrapper"
            >
              <div
                className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-white tracking-[-0.64px] whitespace-nowrap"
                data-node-id="1136:104"
              >
                <p className="leading-[19.2px]">362360825@qq.com</p>
              </div>
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div
        className="absolute content-stretch flex gap-[10px] items-center right-[268px] top-[50px]"
        data-node-id="1164:37"
      >
        <div
          className="relative shrink-0 size-[44px] perspective-[480px]"
          data-node-id="1164:34"
          data-name="Frame"
        >
          <img
            alt=""
            className="hero-loc-pin-motion absolute block inset-0 max-w-none size-full"
            src={imgFrame2}
          />
        </div>
        <div
          className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white tracking-[-0.72px] w-[177px]"
          data-node-id="1164:33"
        >
          <p className="leading-[24px]">Cian Zhang Design base on(guangzhou)</p>
        </div>
      </div>
      <div
        className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[475px] left-[50px] overflow-hidden top-[475px] w-[394px]"
        data-node-id="1164:40"
      >
        <div
          className="absolute left-[29px] top-[29px] flex h-[415px] w-[334px] min-h-0 min-w-0 items-center justify-center overflow-hidden bg-black"
          data-node-id="1164:31"
          data-name="Daniel Hart, Web Designer"
        >
          <video
            className="m-auto block max-h-full max-w-full min-h-0 min-w-0 object-contain object-center pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="头图主视觉循环动画"
          >
            <source src={videoHeroLoop} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="absolute bottom-[16px] h-[64px] left-[20px] w-[1880px]" data-node-id="1164:55" data-name="页眉">
        <div className="absolute h-[21px] left-0 top-0 w-[1880px]" data-node-id="1164:54" data-name="Union">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion} />
        </div>
        <div className="absolute content-stretch flex gap-[20px] items-center left-0 top-[40px]" data-node-id="1164:48">
          <div className="relative shrink-0 size-[4px]" data-node-id="1164:47">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
          </div>
          <div
            className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap"
            data-node-id="1164:42"
          >
            <p className="leading-[23.4px]">00.1</p>
          </div>
        </div>
        <div className="absolute content-stretch flex gap-[20px] items-center left-[550px] top-[40px]" data-node-id="1164:49">
          <div className="relative shrink-0 size-[4px]" data-node-id="1164:50">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
          </div>
          <div
            className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap"
            data-node-id="1164:51"
          >
            <p className="leading-[23.4px]">HOME</p>
          </div>
        </div>
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-[1778.5px] not-italic text-[0px] text-center text-white top-[52px] tracking-[-0.72px] whitespace-nowrap"
          data-node-id="1164:53"
        >
          <p>
            <span className="leading-[23.4px] text-[20px]">{`CIAN ZHANG DESIGN `}</span>
            <span className="leading-[23.4px] text-[10px]">®</span>
          </p>
        </div>
      </div>
    </div>
  );
}
