import { FigmaResumeLayout, heroBrandLogoSrc } from "./FigmaResume";
import { LoadingSplash } from "./LoadingSplash";
import { ScaledViewport } from "./ScaledViewport";
import { StickyHeroBrand } from "./StickyHeroBrand";
import { StickyHeroMenu } from "./StickyHeroMenu";
import type { CaseSlug } from "./caseStudy";
import { useIsCoarsePointer } from "./useIsCoarsePointer";

type ResumePageProps = {
  onOpenCase: (slug: CaseSlug) => void;
  /** 内页打开时不挂载顶栏 Portal，避免 body 上 z-200 盖住内页叠层 */
  suppressHeroChrome?: boolean;
};

/**
 * 设计稿固定 1920px，通过 ScaledViewport 全局等比缩放以铺满视口宽度，不改动 Figma 导出布局。
 * {@link ViewportScaleProvider} 由 {@link App} 包裹，便于内页叠层与简历共用缩放且保持简历挂载。
 */
export function ResumePage({ onOpenCase, suppressHeroChrome }: ResumePageProps) {
  const isCoarsePointer = useIsCoarsePointer();
  return (
    <>
      {!isCoarsePointer ? <LoadingSplash /> : null}
      {!suppressHeroChrome && !isCoarsePointer ? (
        <>
          <StickyHeroBrand logoSrc={heroBrandLogoSrc} />
          <StickyHeroMenu />
        </>
      ) : null}
      <ScaledViewport>
        <FigmaResumeLayout onOpenCase={onOpenCase} />
      </ScaledViewport>
    </>
  );
}
