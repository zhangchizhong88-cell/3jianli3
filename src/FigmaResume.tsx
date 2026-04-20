import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { AboutCardTilt } from "./AboutCardTilt";
import { CopyToClipboard } from "./CopyToast";
import type { CaseSlug } from "./caseStudy";
import { FooterWindParticles } from "./FooterWindParticles";
import { HeroMuxBackground } from "./HeroMuxBackground";
import { HeroSection } from "./HeroSection";
import { ProjectsSnowfall } from "./ProjectsSnowfall";
import { RevealStaggerInner } from "./RevealStaggerInner";
import { OtherWorksStackSection } from "./OtherWorksStackSection";
import { ToolsMarquee } from "./ToolsMarquee";
import { MUX_SECTION_BANNER_HLS_URL } from "./muxSectionBannerHlsUrl";
import { useIsCoarsePointer } from "./useIsCoarsePointer";
const img3A0EHj2RSo7Y4SURxWKxLmH53UWebp = "/figma-assets/9a594177-70cc-4dbd-83e4-3d2ffa31e025.png";
export const heroBrandLogoSrc = img3A0EHj2RSo7Y4SURxWKxLmH53UWebp;
const imgAbout = "/figma-assets/9ece34bf-58c8-4661-8350-6f0391f18134.png";
const imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg = "/figma-assets/45c4751a-a69e-4e97-b55f-7a9e873d4422.png";
const imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng = "/figma-assets/c237590b-0ea2-4fb5-b48e-ba2955d6c2e6.png";
const imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg1 = "/figma-assets/bf0fc3b6-9fbe-419a-82be-e041b208a6c6.png";
const imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng1 = "/figma-assets/707d0770-7ed9-4ce3-90b1-fa75010d0532.png";
const imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg2 = "/figma-assets/5d45c644-89ab-4b20-9154-339f3aa9d36e.png";
const imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng2 = "/figma-assets/a12a3315-91ea-4063-afa9-6347cf06871c.png";
const imgFrame1597880781 = "/figma-assets/5092cb0b-e07c-4c47-b447-4cc7d3e98484.png";
const imgFrame = "/figma-assets/8b831903-dfc9-4c18-8dbf-73161ed106fe.svg";
const imgFrame1 = "/figma-assets/eba160f6-4cae-4873-9543-f6e71f0f815d.svg";
const imgBackground = "/figma-assets/7b128326-3fc7-4c6b-8174-61ce23eecb97.svg";
/** Menu 加号 mask（Portal 固定层与画布共用同一资源） */
export const heroMenuMaskSrc = imgBackground;
const imgUnion = "/figma-assets/b1b749d8-5678-48cd-b721-037039fe6398.svg";
const imgEllipse3 = "/figma-assets/4aeeea71-5a76-4f6e-88a0-50a2571fe37f.svg";
const imgFrame3 = "/figma-assets/50734668-c9a2-46ad-a51b-8fe84ac7f1c0.svg";
const imgFrame1597880775 = "/figma-assets/80b7d5a6-0a11-409d-b47a-d312a0499b8e.svg";
const imgFrame4 = "/figma-assets/14a4066b-3d0b-4813-80a5-830059e6faab.svg";
const imgUnion1 = "/figma-assets/ace31633-5fff-419b-be00-36ae4eb9c3a1.svg";
const imgSubtract = "/figma-assets/d551c21c-8e3c-4eff-a999-3d7bb7de686b.svg";
const imgUnion2 = "/figma-assets/8e1bbb50-98a1-4519-800d-c58d463f2b41.svg";
const imgFrame5 = "/figma-assets/707bff00-da16-446e-b732-737d1629bf98.svg";
const imgFrame6 = "/figma-assets/a92d88ad-77c9-49f4-a8fd-43a8a89ff441.svg";
const imgFrame7 = "/figma-assets/4bb9eb0a-075b-40da-bcb3-fde6205c2923.svg";
const imgUnion3 = "/figma-assets/71b0d287-ab98-4384-ba18-748c62545c0f.svg";
const imgHeroStatic = "/images/hero-artwork.jpg";

/** 块是否与视口有交集（不用 IO：祖先 `overflow-x-clip` 等会导致 IO 误判） */
function isBlockInViewport(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const h = window.visualViewport?.height ?? window.innerHeight;
  const w = window.visualViewport?.width ?? window.innerWidth;
  return r.bottom > 0 && r.top < h && r.right > 0 && r.left < w;
}

/** 进入视口后为 `true`（`useLayoutEffect` + `scroll`/`resize`），配合 `.about-hero-line-in` 入场动画。 */
function useRevealOnViewport(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isBlockInViewport(el)) setVisible(true);
    const id = requestAnimationFrame(() => {
      if (isBlockInViewport(el)) setVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, [ref]);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const tryReveal = () => {
      if (isBlockInViewport(el)) setVisible(true);
    };

    tryReveal();
    window.addEventListener("scroll", tryReveal, { passive: true });
    window.addEventListener("resize", tryReveal, { passive: true });
    return () => {
      window.removeEventListener("scroll", tryReveal);
      window.removeEventListener("resize", tryReveal);
    };
  }, [visible, ref]);

  return visible;
}

type FigmaResumeLayoutProps = {
  onOpenCase?: (slug: CaseSlug) => void;
};

export function FigmaResumeLayout({ onOpenCase }: FigmaResumeLayoutProps) {
  const isCoarsePointer = useIsCoarsePointer();
  const onCaseCardKey = (slug: CaseSlug) => (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenCase?.(slug);
    }
  };

  const whatIDoRef = useRef<HTMLDivElement>(null);
  const aboutHeroLinesRef = useRef<HTMLDivElement>(null);
  const projectsTitlesRef = useRef<HTMLDivElement>(null);
  const otherWorksTitlesRef = useRef<HTMLDivElement>(null);
  const aboutHeroLinesVisible = useRevealOnViewport(aboutHeroLinesRef);
  const projectsTitlesVisible = useRevealOnViewport(projectsTitlesRef);
  const otherWorksTitlesVisible = useRevealOnViewport(otherWorksTitlesRef);

  return (
    <div
      className="relative w-[1920px] shrink-0 bg-transparent"
      data-node-id="1136:78"
      data-name="个人简历首页"
    >
      <div
        className="relative flex w-[1920px] shrink-0 flex-col items-center"
        data-node-id="1136:79"
        data-name="个人网站"
      >
        <HeroSection />
        <div
          id="section-about"
          className="cv-auto relative z-20 shrink-0 scroll-mt-[80px] bg-[#0a0a0a] h-[1498px] w-full"
          data-node-id="1136:130"
          data-name="About"
        >
          <div
            ref={aboutHeroLinesRef}
            className="absolute overflow-visible font-monumentUltra h-[400px] leading-[0] left-[50px] not-italic text-[100px] top-[50px] w-[1820px]"
            data-node-id="1164:59"
          >
            <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.7)] top-[100px] w-[852px]" data-node-id="1164:56">
              <p
                className={`leading-[100px] about-hero-line-in ${aboutHeroLinesVisible ? "about-hero-line-in--run" : ""}`}
              >
                CIAN ZHANG _DESIGN®
              </p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col justify-center right-0 text-[rgba(255,255,255,0.1)] text-right top-[300px] w-[852px]" data-node-id="1164:58">
              <p
                className={`leading-[100px] about-hero-line-in about-hero-line-in--delay ${aboutHeroLinesVisible ? "about-hero-line-in--run" : ""}`}
              >
                / FROM GUANGZHOU
              </p>
            </div>
          </div>
          <div className="absolute h-[64px] left-[20px] top-[480px] w-[1880px]" data-node-id="1164:60" data-name="页眉">
            <div className="absolute h-[21px] left-0 top-0 w-[1880px]" data-node-id="1164:61" data-name="Union">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion} />
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-0 top-[40px]" data-node-id="1164:66">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:67">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:68">
                <p className="leading-[23.4px]">00.2</p>
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-[550px] top-[40px]" data-node-id="1164:69">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:70">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:71">
                <p className="leading-[23.4px]">About Me</p>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:72">
              <p className="leading-[23.4px]">362360825@qq.com</p>
            </div>
          </div>
          <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[774px] left-[100px] overflow-visible rounded-[4px] top-[624px] w-[1710px]" data-node-id="1164:74">
            <div className="-translate-x-1/2 absolute h-[520px] left-[calc(50%+0.5px)] top-[183px] w-[1125px]" data-node-id="1164:75">
              <div className="absolute h-[500px] left-[441px] top-0 w-[684px]" data-node-id="1163:30" data-name="Container">
                <div className="absolute h-[179px] left-0 top-0 w-[684px]" data-node-id="1163:37">
                  <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-0 top-0 w-[684px]" data-node-id="1163:38">
                    <div
                      className="relative flex min-h-[34px] w-full max-w-[684px] shrink-0 flex-wrap items-baseline gap-x-[10px] gap-y-1"
                      data-node-id="1163:39"
                    >
                      <span
                        className="font-['PingFang_SC:Medium',sans-serif] text-[24px] leading-[1.2] not-italic text-white whitespace-nowrap"
                        data-node-id="1163:40"
                      >
                        张驰中
                      </span>
                      <span
                        className="font-['PingFang_SC:Regular',sans-serif] text-[18px] leading-[1.2] not-italic text-[rgba(255,255,255,0.45)]"
                        aria-hidden
                      >
                        |
                      </span>
                      <span
                        className="font-['PingFang_SC:Medium',sans-serif] text-[18px] leading-[1.2] not-italic text-white whitespace-nowrap"
                        data-node-id="1163:41"
                      >
                        设计经理
                      </span>
                      <span
                        className="font-['PingFang_SC:Regular',sans-serif] text-[18px] leading-[1.2] not-italic text-[rgba(255,255,255,0.45)]"
                        aria-hidden
                      >
                        |
                      </span>
                      <span
                        className="font-['PingFang_SC:Regular',sans-serif] text-[18px] leading-[1.2] not-italic text-[rgba(255,255,255,0.6)] whitespace-nowrap"
                        data-node-id="1163:42"
                      >
                        2018 – 2025
                      </span>
                    </div>
                    <p className="font-['PingFang_SC:Regular',sans-serif] leading-[1.65] min-w-full not-italic relative shrink-0 text-[18px] text-white w-full max-w-[684px]" data-node-id="1163:45">
                      张驰中于 2018 年加入荔枝集团任 UI 设计师，全权负责荔枝 APP的 UI 设计，深度参与荔枝 APP5.0版本设计迭代；2020 年晋升设计经理，主导多款产品 UI 设计方案的评审与落地把控，搭建标准化设计审核流程，同时管理15 人以上UI 设计团队并建立新人培养体系。期间统筹并参与荔枝 APP、荔枝播客、PP 语音、TIYA 等核心产品的设计管理工作。
                    </p>
                  </div>
                </div>
                <AboutCardTilt className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[291px] left-0 overflow-clip rounded-bl-[4px] rounded-br-[32px] rounded-tl-[4px] rounded-tr-[4px] top-[229px] w-[322px]" data-node-id="1163:46" data-name="Desktop">
                  <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[23px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[23px]" data-node-id="1163:47">
                    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-[274px]" data-node-id="1163:48" data-name="Title">
                      <div className="content-stretch flex items-end justify-between leading-[0] relative shrink-0 w-[274px]" data-node-id="1163:49">
                        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium h-[60px] justify-center relative shrink-0 text-[60px] text-white tracking-[-2.4px] w-[121px]" data-node-id="1163:50">
                          <p className="leading-[60px]">9+</p>
                        </div>
                        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-[30px] justify-center min-h-[6px] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.5)] tracking-[-0.72px] w-[42px]" data-node-id="1163:51">
                          <p className="leading-[23.4px]">years</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.15)] h-px shrink-0 w-[274px]" data-node-id="1163:52" data-name="Divider" />
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] tracking-[-0.64px] w-[274px]" data-node-id="1163:53">
                      <p className="leading-[20.8px]">主导荔枝 APP、荔枝播客、PP 语音、TIYA 等多款百万级用户产品的全链路设计与迭代，完整经历互联网产品设计全周期，深度负责荔枝 APP 4.0/5.0、PP 品牌重构、荔枝播客，TIYA等里程碑式版本的视觉与体验重构</p>
                    </div>
                  </div>
                </AboutCardTilt>
                <AboutCardTilt className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[291px] left-[362px] overflow-clip rounded-bl-[4px] rounded-br-[32px] rounded-tl-[4px] rounded-tr-[4px] top-[229px] w-[322px]" data-node-id="1163:54" data-name="Desktop">
                  <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[23px] top-[23px]" data-node-id="1163:55">
                    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-[274px]" data-node-id="1163:56" data-name="Title">
                      <div className="content-stretch flex items-end justify-between leading-[0] relative shrink-0 w-[274px]" data-node-id="1163:57">
                        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium h-[60px] justify-center relative shrink-0 text-[60px] text-white tracking-[-2.4px] w-[121px]" data-node-id="1163:58">
                          <p className="leading-[60px]">15+</p>
                        </div>
                        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center min-h-[6px] relative shrink-0 text-[18px] text-[rgba(255,255,255,0.5)] text-right tracking-[-0.72px] whitespace-nowrap" data-node-id="1163:59">
                          <p className="leading-[23.4px]">design management</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.15)] h-px shrink-0 w-[274px]" data-node-id="1163:60" data-name="Divider" />
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] tracking-[-0.64px] w-[274px]" data-node-id="1163:61">
                      <p className="leading-[20.8px]">18年作为执行设计师入职荔枝APP，2020 年后任职荔枝公司设计部设计经理，最高管理 15 + 人团队，带领团队高效交付高质量设计成果，同时负责荔枝 APP / 荔枝播客等多个项目的设计管理与人员培养工作。</p>
                    </div>
                  </div>
                </AboutCardTilt>
              </div>
              <AboutCardTilt className="absolute h-[520px] left-0 top-0 w-[351px]" data-node-id="1164:238">
                <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[500px] left-[20px] rounded-[4px] top-[20px] w-[331px]" data-node-id="1164:237" data-name="About" />
                <div className="absolute h-[500px] left-0 rounded-[4px] top-0 w-[331px]" data-node-id="1163:32" data-name="About">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
                    <img alt="" className="absolute h-[113.28%] left-[-8.53%] max-w-none top-[-11.26%] w-[133.15%]" src={imgAbout} />
                  </div>
                </div>
              </AboutCardTilt>
            </div>
            <div className="absolute left-[1589px] overflow-clip size-[50px] top-[673px]" data-node-id="1164:131">
              <div className="absolute inset-[6.67%]" data-node-id="1164:132">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
            </div>
            <div className="absolute h-[84px] left-[69px] top-[49px] w-[398px]" data-node-id="1164:144">
              <div className="-translate-y-1/2 absolute flex flex-col font-monument font-normal justify-center leading-[0] left-[33px] not-italic right-0 text-[40px] text-white top-[42px]" data-node-id="1136:134">
                <p className="leading-[42px]">My Career Journey</p>
              </div>
              <div className="absolute bg-[#d4ff5b] h-[73px] left-0 top-[3px] w-[13px]" data-node-id="1164:143" />
            </div>
            <div className="absolute left-[1559px] size-[80px] top-[49px]" data-node-id="1168:527">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
            </div>
            <div className="absolute left-[1459px] size-[80px] top-[49px]" data-node-id="1168:534">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
            </div>
          </div>
        </div>
        <div
          ref={whatIDoRef}
          className="cv-auto relative z-20 shrink-0 bg-[#0a0a0a] h-[1795px] w-full"
          data-node-id="1136:175"
          data-name="能力介绍"
        >
          <div className="-translate-x-1/2 absolute h-[189px] left-1/2 top-[144px] w-[1520px]" data-node-id="1164:145">
            <RevealStaggerInner className="h-full w-full">
              <div className="absolute left-[1380px] size-[140px] top-0" data-node-id="1164:149" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
              </div>
              <div className="-translate-y-1/2 absolute flex flex-col font-monument font-normal justify-center leading-[0] left-0 not-italic right-[194px] text-[46px] text-white top-[94.5px]" data-node-id="1164:146">
                <p className="leading-[63px]">I’m the designer who turns (complex ideas) into simple, impactful designs, honoring (intentionality) in every detail.</p>
              </div>
            </RevealStaggerInner>
          </div>
          <div
            className="-translate-x-1/2 absolute left-1/2 top-[1575px] w-[1920px] px-[50px] py-[80px] opacity-90"
            data-node-id="1163:139"
          >
            <ToolsMarquee />
          </div>
          <div className="absolute h-[64px] left-[20px] top-0 w-[1880px]" data-node-id="1164:152" data-name="页眉">
            <div className="absolute h-[21px] left-0 top-0 w-[1880px]" data-node-id="1164:153" data-name="Union">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion1} />
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-0 top-[40px]" data-node-id="1164:158">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:159">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:160">
                <p className="leading-[23.4px]">00.3</p>
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-[550px] top-[40px]" data-node-id="1164:161">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:162">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:163">
                <p className="leading-[23.4px]">What I Do</p>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:164">
              <p className="leading-[23.4px]">{`UI&UX`}</p>
            </div>
          </div>
          <div className="absolute h-[1062px] left-[200px] top-[433px] w-[1520px]" data-node-id="1164:233">
            <div className="absolute h-[243px] left-0 overflow-visible top-0 w-[1520px]" data-node-id="1164:166">
              <RevealStaggerInner className="relative h-full w-full">
              <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.2)] h-px left-1/2 top-[160px] w-[1520px]" data-node-id="1164:167" />
              <div className="absolute h-[120px] leading-[0] left-0 not-italic top-[20px] w-[488px] whitespace-nowrap" data-node-id="1164:183">
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:ExtraLight',sans-serif] justify-center left-0 text-[#d4ff5b] text-[80px] top-[60px]" data-node-id="1164:168">
                  <p className="leading-[120px]">00.1</p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center left-[204px] text-[40px] text-white top-[70px]" data-node-id="1164:171">
                  <p className="leading-[40px]">UI/UX 产品设计</p>
                </div>
              </div>
              <div className="absolute contents left-0 top-[181px]" data-node-id="1164:184">
                <div className="absolute content-stretch flex gap-[10px] items-start left-[1134px] top-[181px]" data-node-id="1164:172">
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:173" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:174">
                      <p className="leading-[30px]">移动端设计</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:175" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:176">
                      <p className="leading-[30px]">原型设计</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:177" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:178">
                      <p className="leading-[30px]">设计系统搭建</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:179" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:180">
                      <p className="leading-[30px]">用户研究</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.5)] top-[202px] w-[940px]" data-node-id="1164:181">
                  <p className="leading-[24px]">从线框到高保真视觉，为移动端与网页产品设计易用界面与流畅体验，以用户需求与业务目标为核心</p>
                </div>
              </div>
            </RevealStaggerInner>
            </div>
            <div className="absolute h-[243px] left-0 overflow-visible top-[273px] w-[1520px]" data-node-id="1164:185">
              <RevealStaggerInner className="relative h-full w-full">
              <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.2)] h-px left-1/2 top-[160px] w-[1520px]" data-node-id="1164:186" />
              <div className="absolute h-[120px] leading-[0] left-0 not-italic top-[20px] w-[644px] whitespace-nowrap" data-node-id="1164:187">
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:ExtraLight',sans-serif] justify-center left-0 text-[#d4ff5b] text-[80px] top-[60px]" data-node-id="1164:188">
                  <p className="leading-[120px]">00.2</p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center left-[204px] text-[40px] text-white top-[70px]" data-node-id="1164:189">
                  <p className="leading-[40px]">品牌视觉与设计体系搭建</p>
                </div>
              </div>
              <div className="absolute contents left-0 top-[181px]" data-node-id="1164:190">
                <div className="absolute content-stretch flex gap-[10px] items-start justify-end left-[1286px] top-[181px]" data-node-id="1164:191">
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:196" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:197">
                      <p className="leading-[30px]">品牌视觉体系搭建</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:198" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:199">
                      <p className="leading-[30px]">UI组件规范</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.5)] top-[202px] w-[940px]" data-node-id="1164:200">
                  <p className="leading-[24px]">搭建完整品牌视觉体系与统一设计规范，帮助产品建立连贯的设计语言，提升整体品牌体验</p>
                </div>
              </div>
            </RevealStaggerInner>
            </div>
            <div className="absolute h-[243px] left-0 overflow-visible top-[546px] w-[1520px]" data-node-id="1164:201">
              <RevealStaggerInner className="relative h-full w-full">
              <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.2)] h-px left-1/2 top-[160px] w-[1520px]" data-node-id="1164:202" />
              <div className="absolute h-[120px] leading-[0] left-0 not-italic top-[20px] w-[488px] whitespace-nowrap" data-node-id="1164:203">
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:ExtraLight',sans-serif] justify-center left-0 text-[#d4ff5b] text-[80px] top-[60px]" data-node-id="1164:204">
                  <p className="leading-[120px]">00.3</p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center left-[204px] text-[40px] text-white top-[70px]" data-node-id="1164:205">
                  <p className="leading-[40px]">{`动效设计 & AI 设计增效`}</p>
                </div>
              </div>
              <div className="absolute contents left-0 top-[181px]" data-node-id="1164:206">
                <div className="absolute content-stretch flex gap-[10px] items-start left-[1196px] top-[181px]" data-node-id="1164:207">
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:208" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:209">
                      <p className="leading-[30px]">AE动效设计</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:210" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:211">
                      <p className="leading-[30px]">AI工具应用</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:212" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:213">
                      <p className="leading-[30px]">UI交互动效设计</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.5)] top-[202px] w-[940px]" data-node-id="1164:216">
                  <p className="leading-[24px]">打造流畅动效与微交互，并熟练运用 AI 工具提升设计效率、迭代速度与产品界面的创意表达</p>
                </div>
              </div>
            </RevealStaggerInner>
            </div>
            <div className="absolute h-[243px] left-0 overflow-visible top-[819px] w-[1520px]" data-node-id="1164:217">
              <RevealStaggerInner className="relative h-full w-full">
              <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.2)] h-px left-1/2 top-[160px] w-[1520px]" data-node-id="1164:218" />
              <div className="absolute h-[120px] leading-[0] left-0 not-italic top-[20px] w-[564px] whitespace-nowrap" data-node-id="1164:219">
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:ExtraLight',sans-serif] justify-center left-0 text-[#d4ff5b] text-[80px] top-[60px]" data-node-id="1164:220">
                  <p className="leading-[120px]">00.4</p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center left-[204px] text-[40px] text-white top-[70px]" data-node-id="1164:221">
                  <p className="leading-[40px]">设计管理与团队统筹</p>
                </div>
              </div>
              <div className="absolute contents left-0 top-[181px]" data-node-id="1164:222">
                <div className="absolute content-stretch flex gap-[10px] items-start left-[1147px] top-[181px]" data-node-id="1164:223">
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:224" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:225">
                      <p className="leading-[30px]">设计流程制定</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:226" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:227">
                      <p className="leading-[30px]">人才培养</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:228" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:229">
                      <p className="leading-[30px]">质量把控</p>
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex items-center justify-center overflow-clip px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="1164:230" data-name="Dark">
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.56px] whitespace-nowrap" data-node-id="1164:231">
                      <p className="leading-[30px]">团队管理</p>
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.5)] top-[202px] w-[940px]" data-node-id="1164:232">
                  <p className="leading-[24px]">作为设计管理者，带领设计团队搭建设计规范与人才培养体系，统筹全链路设计交付，保障项目效率</p>
                </div>
              </div>
            </RevealStaggerInner>
            </div>
          </div>
        </div>
        <div className="h-[600px] relative shrink-0 w-[1920px]" data-node-id="1164:266">
          <div className="-translate-x-1/2 absolute h-[600px] left-1/2 top-0 w-[1920px]" data-node-id="1164:239" data-name="image 4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {!isCoarsePointer ? (
                <HeroMuxBackground
                  hlsUrl={MUX_SECTION_BANNER_HLS_URL}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transform-gpu"
                />
              ) : (
                <img
                  alt=""
                  src={imgHeroStatic}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="-translate-x-1/2 absolute bg-gradient-to-t from-[#0a0a0a] h-[600px] left-1/2 to-[rgba(10,10,10,0.5)] top-0 w-[1920px]" data-node-id="1165:440" data-name="image 5" />
          <div className="-translate-x-1/2 absolute bottom-[35%] left-1/2 top-[35%] w-[180px]" data-node-id="1164:241">
            <div className="absolute border border-solid border-white bottom-1/2 left-0 right-1/2 rounded-br-[300px] top-0" data-node-id="1164:242" />
            <div className="absolute border border-solid border-white bottom-1/2 left-1/2 right-0 rounded-br-[130px] rounded-tr-[130px] top-0" data-node-id="1164:243" />
            <div className="absolute bottom-0 left-0 right-1/2 top-1/2" data-node-id="1164:244" data-name="Subtract">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSubtract} />
            </div>
            <div className="absolute border border-solid border-white bottom-0 left-1/2 right-0 rounded-tl-[300px] top-1/2" data-node-id="1164:247" />
          </div>
          <div className="absolute h-[40px] left-[100px] top-[280px] w-[647px]" data-node-id="1164:262">
            <div className="absolute h-[40px] left-0 top-0 w-[207px]" data-node-id="1164:254">
              <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-[20px] not-italic text-[20px] text-white top-[20px] whitespace-nowrap" data-node-id="1164:249">
                <p className="leading-[40px]">Design with purpose</p>
              </div>
              <div className="absolute contents left-0 top-[14px]" data-node-id="1164:253">
                <div className="absolute flex items-center justify-center left-0 size-[12px] top-[14px]">
                  <div className="flex-none rotate-45">
                    <div className="bg-[#d4ff5b] size-[8.485px]" data-node-id="1164:251" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.2)] h-px left-[247px] top-[20px] w-[400px]" data-node-id="1164:259" />
          </div>
          <div className="absolute h-[40px] left-[1201px] top-[280px] w-[619px]" data-node-id="1164:261">
            <div className="absolute h-[40px] right-0 top-0 w-[179px]" data-node-id="1164:255">
              <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[20px] text-white top-[20px] whitespace-nowrap" data-node-id="1164:256">
                <p className="leading-[40px]">Craft every detail</p>
              </div>
              <div className="absolute contents left-[167px] top-[14px]" data-node-id="1164:257">
                <div className="absolute flex items-center justify-center left-[167px] size-[12px] top-[14px]">
                  <div className="flex-none rotate-45">
                    <div className="bg-[#d4ff5b] size-[8.485px]" data-node-id="1164:258" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.2)] h-px left-0 top-[20px] w-[400px]" data-node-id="1164:260" />
          </div>
        </div>
        <div
          id="section-projects"
          className="cv-auto relative z-20 shrink-0 scroll-mt-[80px] overflow-clip bg-[#0a0a0a] h-[3353px] w-full"
          data-node-id="1136:272"
          data-name="Projects"
        >
          {!isCoarsePointer ? <ProjectsSnowfall /> : null}
          <div className="absolute h-[64px] left-[20px] top-[40px] w-[1880px]" data-node-id="1164:267" data-name="页眉">
            <div className="absolute h-[21px] left-[280px] top-0 w-[1600px]" data-node-id="1164:268" data-name="Union">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion2} />
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-[280px] top-[40px]" data-node-id="1164:273">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:274">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:275">
                <p className="leading-[23.4px]">00.4</p>
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[20px] items-center left-[843px] top-[40px]" data-node-id="1164:276">
              <div className="relative shrink-0 size-[4px]" data-node-id="1164:277">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
              </div>
              <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:278">
                <p className="leading-[23.4px]">Selected Projects</p>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap" data-node-id="1164:279">
              <p className="leading-[23.4px]">VIEW WORK</p>
            </div>
          </div>
          <div
            ref={projectsTitlesRef}
            className="absolute h-[200px] overflow-visible left-[300px] top-[184px] w-[1239px]"
            data-node-id="1164:290"
            data-name="标题"
          >
            <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-[rgba(255,255,255,0.7)] top-[50px] w-[852px]" data-node-id="1164:263">
              <p
                className={`leading-[100px] whitespace-pre-wrap about-hero-line-in ${projectsTitlesVisible ? "about-hero-line-in--run" : ""}`}
              >{`Selected        `}</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-white top-[150px] w-[919px]" data-node-id="1164:286">
              <p
                className={`leading-[100px] whitespace-pre-wrap about-hero-line-in about-hero-line-in--delay ${projectsTitlesVisible ? "about-hero-line-in--run" : ""}`}
              >{`.       Projects`}</p>
            </div>
            <div
              className={`absolute left-[1139px] size-[100px] top-[100px] about-hero-line-in about-hero-line-in--delay2 ${projectsTitlesVisible ? "about-hero-line-in--run" : ""}`}
              data-node-id="1164:287"
              data-name="Frame"
            >
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
            </div>
          </div>
          <div className="absolute h-[2689px] left-[300px] top-[514px] w-[1620px]" data-node-id="1165:391">
            <div className="absolute font-['PingFang_SC:Regular',sans-serif] h-[40px] leading-[0] left-0 not-italic text-[32px] text-white top-0 w-[1570px] whitespace-nowrap" data-node-id="1165:390">
              <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[20px]" data-node-id="1164:314">
                <p className="leading-[40px] whitespace-pre">{`//  End-to-end product design & brand visual portfolio`}</p>
              </div>
              <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[1570px] text-right top-[20px]" data-node-id="1164:319">
                <p className="leading-[40px]">2022-2026</p>
              </div>
            </div>
            <div
              className="absolute h-[813px] left-0 right-0 top-[90px]"
              data-node-id="1165:331"
              data-name="作品1"
            >
              <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[813px] left-0 rounded-bl-[140px] rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] top-0 w-[1620px]" data-node-id="1164:318" />
              <div
                className="group absolute h-[613px] left-[100px] cursor-pointer overflow-hidden rounded-[20px] top-[100px] w-[900px] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                data-node-id="1164:293"
                data-name="t1BP9pCAvSl5aXao3dQWVGM4PE.jpeg"
                role="button"
                tabIndex={0}
                onClick={() => onOpenCase?.("pp-voice")}
                onKeyDown={onCaseCardKey("pp-voice")}
              >
                <img
                  alt=""
                  className="absolute inset-0 max-w-none size-full rounded-[20px] object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                  src={imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg}
                />
              </div>
              <div className="absolute content-stretch flex flex-col gap-[80px] items-start left-[1090px] right-[100px] top-[100px]" data-node-id="1164:296" data-name="Details">
                <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full" data-node-id="1164:297" data-name="Header">
                  <div className="bg-[rgba(255,255,255,0)] overflow-clip relative rounded-[8px] shadow-[0px_0.796px_0.796px_-0.5px_rgba(0,0,0,0.1),0px_2.415px_2.415px_-1px_rgba(0,0,0,0.11),0px_6.383px_6.383px_-1.5px_rgba(0,0,0,0.12),0px_20px_20px_-2px_rgba(0,0,0,0.15)] shrink-0 size-[80px]" data-node-id="1164:298" data-name="Logo">
                    <div className="absolute inset-0 rounded-[20px]" data-node-id="1164:299" data-name="mKYWul4Qt1QkEy6zC4ytOFRlfU.png">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[20px] items-start leading-[0] not-italic relative shrink-0 tracking-[-0.72px]" data-node-id="1164:300" data-name="Text Wrapper">
                    <div className="flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center relative shrink-0 text-[26px] text-white w-[426px]" data-node-id="1164:301">
                      <p className="leading-[30px]">PP语音 - 品牌升级</p>
                    </div>
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center relative shrink-0 text-[22px] text-[rgba(255,255,255,0.8)] w-[430px]" data-node-id="1164:302">
                      <p className="leading-[30px]">为头部语音社交平台 PP 语音打造全链路品牌升级，覆盖视觉体系迭代、产品体验优化与用户增长设计。</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="1164:321">
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1164:304" data-name="Client">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1164:305">
                      <p className="leading-[24px]">project cycle</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1164:306">
                      <p className="leading-[24px]">4个月</p>
                    </div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-[430px]" data-node-id="1164:307" data-name="Divider" />
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1164:308" data-name="Date">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1164:309">
                      <p className="leading-[24px]">Date</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1164:310">
                      <p className="leading-[24px]">01/ 2025</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-[100px] left-[1090px] top-[613px] w-[430px]" data-node-id="1165:330">
                <div
                  className="absolute left-0 top-0 h-[100px] w-[430px] cursor-pointer rounded-bl-[8px] rounded-br-[24px] rounded-tl-[8px] rounded-tr-[8px] bg-[#d4ff5b] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  data-node-id="1165:322"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenCase?.("pp-voice")}
                  onKeyDown={onCaseCardKey("pp-voice")}
                />
                <div
                  className="pointer-events-none absolute h-[84px] left-[322px] top-[8px] w-[100px]"
                  data-node-id="1165:329"
                >
                  <div className="absolute bg-[#0a0a0a] h-[84px] left-0 rounded-bl-[4px] rounded-br-[24px] rounded-tl-[4px] rounded-tr-[4px] top-0 w-[100px]" data-node-id="1165:323" />
                  <div className="absolute left-[16px] size-[68px] top-[7px]" data-node-id="1165:326" data-name="Frame">
                    <img
                      alt=""
                      className="view-details-arrow-nudge absolute block inset-0 max-w-none size-full"
                      src={imgFrame6}
                    />
                  </div>
                </div>
                <div className="pointer-events-none -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center leading-[0] left-[calc(50%-143px)] not-italic text-[30px] text-black top-1/2 whitespace-nowrap" data-node-id="1165:324">
                  <p className="leading-[20px]">View Details</p>
                </div>
              </div>
              <div className="absolute left-[1510px] size-[80px] top-[30px]" data-node-id="1165:419">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
              </div>
            </div>
            <div
              className="absolute h-[813px] left-0 right-0 top-[983px]"
              data-node-id="1165:361"
              data-name="作品2"
            >
              <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[813px] left-0 rounded-bl-[140px] rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] top-0 w-[1620px]" data-node-id="1165:362" />
              <div
                className="group absolute h-[613px] left-[100px] cursor-pointer overflow-hidden rounded-[20px] top-[100px] w-[900px] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                data-node-id="1165:363"
                data-name="t1BP9pCAvSl5aXao3dQWVGM4PE.jpeg"
                role="button"
                tabIndex={0}
                onClick={() => onOpenCase?.("tiya")}
                onKeyDown={onCaseCardKey("tiya")}
              >
                <img
                  alt=""
                  className="absolute inset-0 max-w-none size-full rounded-[20px] object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                  src={imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg1}
                />
              </div>
              <div className="absolute content-stretch flex flex-col gap-[80px] items-start left-[1090px] right-[100px] top-[100px]" data-node-id="1165:364" data-name="Details">
                <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full" data-node-id="1165:365" data-name="Header">
                  <div className="bg-[rgba(255,255,255,0)] overflow-clip relative rounded-[8px] shadow-[0px_0.796px_0.796px_-0.5px_rgba(0,0,0,0.1),0px_2.415px_2.415px_-1px_rgba(0,0,0,0.11),0px_6.383px_6.383px_-1.5px_rgba(0,0,0,0.12),0px_20px_20px_-2px_rgba(0,0,0,0.15)] shrink-0 size-[80px]" data-node-id="1165:366" data-name="Logo">
                    <div className="absolute inset-0 rounded-[20px]" data-node-id="1165:367" data-name="mKYWul4Qt1QkEy6zC4ytOFRlfU.png">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[20px] items-start leading-[0] not-italic relative shrink-0 tracking-[-0.72px]" data-node-id="1165:368" data-name="Text Wrapper">
                    <div className="flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center relative shrink-0 text-[26px] text-white w-[426px]" data-node-id="1165:369">
                      <p className="leading-[30px]">TiYA - Z世代社交App设计</p>
                    </div>
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center relative shrink-0 text-[22px] text-[rgba(255,255,255,0.8)] w-[430px]" data-node-id="1165:370">
                      <p className="leading-[30px]">T!YA 是一款面向 Z 世代的位置社交 App，以地图社交、活动分享与实时语音互动为核心。</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="1165:371">
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1165:372" data-name="Client">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1165:373">
                      <p className="leading-[24px]">project cycle</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1165:374">
                      <p className="leading-[24px]">2个月</p>
                    </div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-[430px]" data-node-id="1165:375" data-name="Divider" />
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1165:376" data-name="Date">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1165:377">
                      <p className="leading-[24px]">Date</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1165:378">
                      <p className="leading-[24px]">03/ 2024</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-[100px] left-[1090px] top-[613px] w-[430px]" data-node-id="1165:379">
                <div
                  className="absolute left-0 top-0 h-[100px] w-[430px] cursor-pointer rounded-bl-[8px] rounded-br-[24px] rounded-tl-[8px] rounded-tr-[8px] bg-[#d4ff5b] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  data-node-id="1165:380"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenCase?.("tiya")}
                  onKeyDown={onCaseCardKey("tiya")}
                />
                <div
                  className="pointer-events-none absolute h-[84px] left-[322px] top-[8px] w-[100px]"
                  data-node-id="1165:381"
                >
                  <div className="absolute bg-[#0a0a0a] h-[84px] left-0 rounded-bl-[4px] rounded-br-[24px] rounded-tl-[4px] rounded-tr-[4px] top-0 w-[100px]" data-node-id="1165:382" />
                  <div className="absolute left-[16px] size-[68px] top-[7px]" data-node-id="1165:383" data-name="Frame">
                    <img
                      alt=""
                      className="view-details-arrow-nudge absolute block inset-0 max-w-none size-full"
                      src={imgFrame6}
                    />
                  </div>
                </div>
                <div className="pointer-events-none -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center leading-[0] left-[calc(50%-143px)] not-italic text-[30px] text-black top-1/2 whitespace-nowrap" data-node-id="1165:385">
                  <p className="leading-[20px]">View Details</p>
                </div>
              </div>
              <div className="absolute left-[1510px] size-[80px] top-[30px]" data-node-id="1165:420">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
              </div>
            </div>
            <div
              className="absolute h-[813px] left-0 right-0 top-[1876px]"
              data-node-id="1165:332"
              data-name="作品3"
            >
              <div className="absolute border border-[rgba(255,255,255,0.2)] border-solid h-[813px] left-0 rounded-bl-[140px] rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] top-0 w-[1620px]" data-node-id="1165:333" />
              <div
                className="group absolute inset-[100px_620px_100px_100px] cursor-pointer overflow-hidden rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                data-node-id="1165:357"
                data-name="t1BP9pCAvSl5aXao3dQWVGM4PE.jpeg"
                role="button"
                tabIndex={0}
                onClick={() => onOpenCase?.("lizhi-podcast")}
                onKeyDown={onCaseCardKey("lizhi-podcast")}
              >
                <img
                  alt=""
                  className="absolute inset-0 max-w-none size-full rounded-[20px] object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                  src={imgT1Bp9PCAvSl5AXao3DQwvgm4PeJpeg2}
                />
              </div>
              <div className="absolute content-stretch flex flex-col gap-[80px] items-start left-[1090px] right-[100px] top-[100px]" data-node-id="1165:335" data-name="Details">
                <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full" data-node-id="1165:336" data-name="Header">
                  <div className="bg-[rgba(255,255,255,0)] overflow-clip relative rounded-[8px] shadow-[0px_0.796px_0.796px_-0.5px_rgba(0,0,0,0.1),0px_2.415px_2.415px_-1px_rgba(0,0,0,0.11),0px_6.383px_6.383px_-1.5px_rgba(0,0,0,0.12),0px_20px_20px_-2px_rgba(0,0,0,0.15)] shrink-0 size-[80px]" data-node-id="1165:337" data-name="Logo">
                    <div className="absolute inset-0 rounded-[20px]" data-node-id="1165:359" data-name="mKYWul4Qt1QkEy6zC4ytOFRlfU.png">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgMKyWul4Qt1QkEy6ZC4YtOfRlfUPng2} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[20px] items-start leading-[0] not-italic relative shrink-0 tracking-[-0.72px]" data-node-id="1165:339" data-name="Text Wrapper">
                    <div className="flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center relative shrink-0 text-[26px] text-white w-[426px]" data-node-id="1165:340">
                      <p className="leading-[30px]">荔枝播客 - 专业播客平台设计</p>
                    </div>
                    <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center relative shrink-0 text-[22px] text-[rgba(255,255,255,0.8)] w-[430px]" data-node-id="1165:341">
                      <p className="leading-[30px]">为满足专业播客用户需求，荔枝推出垂类专属平台「荔枝播客」，严选优质音频、孵化头部 IP，打造专业纯粹的播客收听体验。</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="1165:342">
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1165:343" data-name="Client">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1165:344">
                      <p className="leading-[24px]">project cycle</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1165:345">
                      <p className="leading-[24px]">3个月</p>
                    </div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-[430px]" data-node-id="1165:346" data-name="Divider" />
                  <div className="font-['PingFang_SC:Regular',sans-serif] h-[24px] leading-[0] not-italic relative shrink-0 text-[20px] w-[430px] whitespace-nowrap" data-node-id="1165:347" data-name="Date">
                    <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[rgba(255,255,255,0.8)] top-1/2 tracking-[-0.64px]" data-node-id="1165:348">
                      <p className="leading-[24px]">Date</p>
                    </div>
                    <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[430px] text-right text-white top-1/2" data-node-id="1165:349">
                      <p className="leading-[24px]">12/ 2022</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-[100px] left-[1090px] top-[613px] w-[430px]" data-node-id="1165:350">
                <div
                  className="absolute left-0 top-0 h-[100px] w-[430px] cursor-pointer rounded-bl-[8px] rounded-br-[24px] rounded-tl-[8px] rounded-tr-[8px] bg-[#d4ff5b] outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  data-node-id="1165:351"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenCase?.("lizhi-podcast")}
                  onKeyDown={onCaseCardKey("lizhi-podcast")}
                />
                <div
                  className="pointer-events-none absolute h-[84px] left-[322px] top-[8px] w-[100px]"
                  data-node-id="1165:352"
                >
                  <div className="absolute bg-[#0a0a0a] h-[84px] left-0 rounded-bl-[4px] rounded-br-[24px] rounded-tl-[4px] rounded-tr-[4px] top-0 w-[100px]" data-node-id="1165:353" />
                  <div className="absolute left-[16px] size-[68px] top-[7px]" data-node-id="1165:354" data-name="Frame">
                    <img
                      alt=""
                      className="view-details-arrow-nudge absolute block inset-0 max-w-none size-full"
                      src={imgFrame6}
                    />
                  </div>
                </div>
                <div className="pointer-events-none -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] justify-center leading-[0] left-[calc(50%-143px)] not-italic text-[30px] text-black top-1/2 whitespace-nowrap" data-node-id="1165:356">
                  <p className="leading-[20px]">View Details</p>
                </div>
              </div>
              <div className="absolute left-[1510px] size-[80px] top-[30px]" data-node-id="1165:427">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
              </div>
            </div>
          </div>
        </div>
        {isCoarsePointer ? (
          <div
            className="cv-auto relative z-20 shrink-0 overflow-hidden bg-[#0a0a0a] h-[1200px] w-full"
            data-node-id="1136:362"
            data-name="其他项目"
          >
            <div className="absolute h-[64px] left-[20px] top-[24px] w-[1880px]" data-node-id="1165:392" data-name="页眉">
              <div className="absolute h-[21px] left-[280px] top-0 w-[1600px]" data-node-id="1165:393" data-name="Union">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion2} />
              </div>
              <div className="absolute content-stretch flex gap-[20px] items-center left-[280px] top-[40px]" data-node-id="1165:398">
                <div className="relative shrink-0 size-[4px]" data-node-id="1165:399">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:400">
                  <p className="leading-[23.4px]">00.5</p>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[20px] items-center left-[843px] top-[40px]" data-node-id="1165:401">
                <div className="relative shrink-0 size-[4px]" data-node-id="1165:402">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:403">
                  <p className="leading-[23.4px] whitespace-pre">{`Other  Creative Works`}</p>
                </div>
              </div>
              <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:404">
                <p className="leading-[23.4px]">VIEW WORK</p>
              </div>
            </div>
            <div
              ref={otherWorksTitlesRef}
              className="absolute h-[200px] overflow-visible left-[280px] top-[144px] w-[1239px]"
              data-node-id="1165:405"
              data-name="标题"
            >
              <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-white top-[50px] w-[852px]" data-node-id="1165:406">
                <p
                  className={`leading-[100px] about-hero-line-in ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                >
                  Other
                </p>
              </div>
              <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-white top-[150px] w-[1270px]" data-node-id="1165:407">
                <p
                  className={`leading-[100px] whitespace-pre-wrap about-hero-line-in about-hero-line-in--delay ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                >{`//  Creative Works`}</p>
              </div>
              <div
                className={`absolute left-[1446px] size-[74px] top-[113px] about-hero-line-in about-hero-line-in--delay2 ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                data-node-id="1165:434"
                data-name="Frame"
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame7} />
              </div>
            </div>
            <OtherWorksStackSection />
          </div>
        ) : (
          <div
            className="cv-auto relative z-20 shrink-0 overflow-hidden bg-[#0a0a0a] h-[1200px] w-full"
            data-node-id="1136:362"
            data-name="其他项目"
          >
            <div className="absolute h-[344px] left-[20px] top-0 w-[1880px]" data-node-id="1165:411">
              <div className="absolute h-[64px] left-0 top-0 w-[1880px]" data-node-id="1165:392" data-name="页眉">
                <div className="absolute h-[21px] left-[280px] top-0 w-[1600px]" data-node-id="1165:393" data-name="Union">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion2} />
                </div>
                <div className="absolute content-stretch flex gap-[20px] items-center left-[280px] top-[40px]" data-node-id="1165:398">
                  <div className="relative shrink-0 size-[4px]" data-node-id="1165:399">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                  </div>
                  <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:400">
                    <p className="leading-[23.4px]">00.5</p>
                  </div>
                </div>
                <div className="absolute content-stretch flex gap-[20px] items-center left-[843px] top-[40px]" data-node-id="1165:401">
                  <div className="relative shrink-0 size-[4px]" data-node-id="1165:402">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                  </div>
                  <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:403">
                    <p className="leading-[23.4px] whitespace-pre">{`Other  Creative Works`}</p>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic right-0 text-[20px] text-right text-white top-[52px] tracking-[-0.72px] whitespace-nowrap" data-node-id="1165:404">
                  <p className="leading-[23.4px]">VIEW WORK</p>
                </div>
              </div>
              <div
                ref={otherWorksTitlesRef}
                className="absolute h-[200px] overflow-visible left-[280px] top-[144px] w-[1239px]"
                data-node-id="1165:405"
                data-name="标题"
              >
                <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-white top-[50px] w-[852px]" data-node-id="1165:406">
                  <p
                    className={`leading-[100px] about-hero-line-in ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                  >
                    Other
                  </p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-0 not-italic text-[100px] text-white top-[150px] w-[1270px]" data-node-id="1165:407">
                  <p
                    className={`leading-[100px] whitespace-pre-wrap about-hero-line-in about-hero-line-in--delay ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                  >{`//  Creative Works`}</p>
                </div>
                <div
                  className={`absolute left-[1446px] size-[74px] top-[113px] about-hero-line-in about-hero-line-in--delay2 ${otherWorksTitlesVisible ? "about-hero-line-in--run" : ""}`}
                  data-node-id="1165:434"
                  data-name="Frame"
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame7} />
                </div>
              </div>
            </div>
            <OtherWorksStackSection />
          </div>
        )}
        <div className="cv-auto relative z-20 shrink-0 overflow-clip bg-[#0a0a0a] h-[923px] w-full" data-node-id="1136:392" data-name="底部">
          {!isCoarsePointer ? <FooterWindParticles /> : null}
          <div className="absolute h-[423px] left-[20px] top-[450px] w-[1880px]" data-node-id="1168:495">
            <div className="absolute bottom-0 h-[41px] left-0 overflow-clip w-[1880px]" data-node-id="1136:426" data-name="Footer">
              <div className="absolute font-['PingFang_SC:Regular',sans-serif] h-[22px] leading-[0] not-italic overflow-clip right-0 text-[16px] top-[18.39px] w-[266px]" data-node-id="1136:427" data-name="Credit">
                <div className="absolute bottom-0 h-[22px] right-0 w-[136px]" data-node-id="1136:428" data-name="Created By">
                  <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[#999] top-1/2 w-[82px]" data-node-id="1136:429">
                    <p className="leading-[22px]">Created by</p>
                  </div>
                  <div className="-translate-y-1/2 absolute flex flex-col justify-center right-[48px] text-white top-1/2 translate-x-full whitespace-nowrap" data-node-id="1136:430">
                    <p className="leading-[22px]">张驰中</p>
                  </div>
                </div>
                <div className="absolute bottom-0 h-[22px] right-[156px] w-[171px] whitespace-nowrap" data-node-id="1136:431" data-name="Created By">
                  <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 text-[#999] top-1/2" data-node-id="1136:432">
                    <p className="leading-[22px]">{`Made in `}</p>
                  </div>
                  <div className="-translate-y-1/2 absolute flex flex-col justify-center right-[106px] text-white top-1/2 translate-x-full" data-node-id="1136:433">
                    <p className="leading-[22px]">{`Figma&Cursor`}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[0.61px] h-[22px] left-[30px] w-[294px]" data-node-id="1136:434" data-name="Created By">
                <div className="-translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] left-[-30px] not-italic text-[16px] text-white top-1/2 whitespace-nowrap" data-node-id="1136:435">
                  <p className="leading-[22px]">© ZCZ Design 2026. All rights reserved.</p>
                </div>
              </div>
              <div className="-translate-x-1/2 absolute border-[#1f1f1f] border-solid border-t bottom-0 left-1/2 top-0 w-[1880px]" data-node-id="1136:436" data-name="HorizontalBorder" />
            </div>
            <div className="absolute h-[118px] left-0 top-[164px] w-[1880px]" data-node-id="1168:494">
              <div className="-translate-y-1/2 absolute h-[118px] left-0 top-1/2 w-[577px]" data-node-id="1136:414" data-name="Link - Dekstop">
                <div className="-translate-y-1/2 absolute aspect-[100/100] left-0 right-[463px] rounded-[6px] top-[calc(50%-2px)]" data-node-id="1136:415" data-name="3A0EHj2rSo7y4sURxWKxLmH53U.webp">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[6px]">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={img3A0EHj2RSo7Y4SURxWKxLmH53UWebp} />
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col font-monumentUltra justify-center leading-[0] left-[129px] not-italic text-[57px] text-white top-[57px] whitespace-nowrap" data-node-id="1168:463">
                  <p className="leading-[57px] mb-0 whitespace-pre">{`Cian Zhang `}</p>
                  <p className="leading-[57px] whitespace-pre">Design</p>
                </div>
              </div>
              <div className="absolute font-['PingFang_SC:Regular',sans-serif] h-[118px] leading-[0] left-[722px] not-italic top-0 w-[441px]" data-node-id="1168:491">
                <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 right-[19px] text-[30px] text-white top-[20px] whitespace-nowrap" data-node-id="1136:418">
                  <p className="leading-[40px]">Ready to create with purpose?</p>
                </div>
                <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 right-0 text-[#999] text-[18px] top-[94px]" data-node-id="1136:419">
                  <p className="leading-[24px] mb-0">我是张驰中，拥有丰富的 UI/UX 设计经验。</p>
                  <p className="leading-[24px]">如果你正在找靠谱的设计师伙伴，随时和我聊聊。</p>
                </div>
              </div>
              <div
                className="absolute font-['Geist:Regular',sans-serif] font-normal h-[117px] leading-[0] overflow-visible right-[490.26px] text-[16px] top-0 tracking-[-0.64px] w-[55.737px]"
                data-node-id="1136:421"
                data-name="Main Nav"
              >
                <button
                  type="button"
                  className="-translate-y-1/2 absolute left-0 top-[10.5px] flex h-[21px] w-[41.214px] cursor-pointer flex-col justify-center border-0 bg-transparent p-0 text-left font-['Geist:Regular',sans-serif] text-[16px] font-normal tracking-[-0.64px] text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  data-node-id="1136:422"
                  onClick={() => document.getElementById("section-home")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <span className="leading-[20.8px]">Home</span>
                </button>
                <button
                  type="button"
                  className="-translate-y-1/2 absolute left-0 top-[58.5px] flex h-[21px] w-[41.254px] cursor-pointer flex-col justify-center border-0 bg-transparent p-0 text-left font-['Geist:Regular',sans-serif] text-[16px] font-normal tracking-[-0.64px] text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  data-node-id="1136:424"
                  onClick={() => document.getElementById("section-about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <span className="leading-[20.8px]">About</span>
                </button>
                <button
                  type="button"
                  className="-translate-y-1/2 absolute left-0 top-[106.5px] flex h-[21px] w-[55.737px] cursor-pointer flex-col justify-center border-0 bg-transparent p-0 text-left font-['Geist:Regular',sans-serif] text-[16px] font-normal tracking-[-0.64px] text-white transition-colors duration-200 hover:text-[#d4ff5b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4ff5b]"
                  data-node-id="1136:423"
                  onClick={() => document.getElementById("section-projects")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <span className="leading-[20.8px]">Projects</span>
                </button>
              </div>
              <div className="absolute h-[118px] left-[1658px] top-0 w-[222px]" data-node-id="1168:492">
                <CopyToClipboard
                  text="18818390506"
                  className="absolute bg-[#d4ff5b] content-stretch flex gap-[10px] items-center px-[47px] py-[16px] right-0 rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] top-0 w-[222px]"
                  data-node-id="1168:472"
                  data-name="Link - Primary Inverse"
                >
                  <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="1168:473" data-name="Icon L">
                    <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="1168:474" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-node-id="1168:480" data-name="Text Wrapper">
                    <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-black tracking-[-0.64px] whitespace-nowrap" data-node-id="1168:481">
                      <p className="leading-[19.2px]">18818390506</p>
                    </div>
                  </div>
                </CopyToClipboard>
                <CopyToClipboard
                  text="362360825@qq.com"
                  className="absolute border border-solid border-white content-stretch flex gap-[10px] items-center px-[20px] py-[16px] right-0 rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[4px] top-[66px]"
                  data-node-id="1168:482"
                  data-name="Link - Primary Inverse"
                >
                  <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="1168:483" data-name="Icon L">
                    <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="1168:484" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-node-id="1168:487" data-name="Text Wrapper">
                    <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[16px] text-white tracking-[-0.64px] whitespace-nowrap" data-node-id="1168:488">
                      <p className="leading-[19.2px]">362360825@qq.com</p>
                    </div>
                  </div>
                </CopyToClipboard>
              </div>
            </div>
            <div className="absolute h-[64px] left-0 top-0 w-[1880px]" data-node-id="1168:449" data-name="页眉">
              <div className="absolute h-[21px] left-0 top-0 w-[1880px]" data-node-id="1168:450" data-name="Union">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnion3} />
              </div>
              <div className="absolute content-stretch flex gap-[20px] items-center left-0 top-[40px]" data-node-id="1168:455">
                <div className="relative shrink-0 size-[4px]" data-node-id="1168:456">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1168:457">
                  <p className="leading-[23.4px]">00.6</p>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[20px] items-center left-[720px] top-[40px]" data-node-id="1168:458">
                <div className="relative shrink-0 size-[4px]" data-node-id="1168:459">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1168:460">
                  <p className="leading-[23.4px]">Get in Touch</p>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[20px] items-center left-[1330px] top-[40px]" data-node-id="1168:468">
                <div className="relative shrink-0 size-[4px]" data-node-id="1168:469">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="flex flex-col font-['PingFang_SC:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-white tracking-[-0.72px] whitespace-nowrap" data-node-id="1168:470">
                  <p className="leading-[23.4px]">Contact</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute h-[350px] left-[50px] top-[50px] w-[1820px]" data-node-id="1168:526">
            <div className="absolute font-monumentUltra h-[200px] leading-[0] left-[1050px] not-italic text-[100px] text-white top-[150px] w-[770px]" data-node-id="1168:510">
              <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[50px] w-[770px]" data-node-id="1168:496">
                <p className="leading-[100px] whitespace-pre-wrap">{`IDEAS →  `}</p>
              </div>
              <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[150px] w-[770px]" data-node-id="1168:498">
                <p className="leading-[100px] whitespace-pre-wrap">{`     REALITY`}</p>
              </div>
            </div>
            <div className="absolute h-[130px] left-0 top-0 w-[610px]" data-node-id="1168:509">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="130" src={imgFrame1597880781} width="610" />
            </div>
            <div className="absolute left-[1740px] size-[80px] top-0" data-node-id="1168:513">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
            </div>
            <div className="absolute left-[1640px] size-[80px] top-0" data-node-id="1168:520">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1597880775} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}