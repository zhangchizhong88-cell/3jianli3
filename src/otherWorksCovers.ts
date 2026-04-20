/**
 * 「其他项目」封面与灯箱内页：资源放在 `public/other-works-covers/cover-XX/`，
 * 由脚本生成 `src/generated/*`，详见该目录内 `资源说明.txt`。
 */
export { OTHER_WORKS_COVER_URLS } from "./generated/otherWorksCoverUrls";

/** 灯箱内页：由脚本扫描 `public/other-works-covers/cover-XX/detail*.`（图或视频）自动生成 */
export { OTHER_WORK_COVER_LIGHTBOX_INNER } from "./generated/otherWorksLightboxInner";

/** 走马灯 / 灯箱封面是否为视频（由 `OTHER_WORKS_COVER_URLS` 路径扩展名决定） */
export function otherWorksCoverIsVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

/** 区块设计宽度（与 Figma `1167:448` 外层 `w-[2379px]` 一致） */
export const OTHER_WORKS_VIEWPORT_W = 2379;

/** 与 `OtherWorksStackSection` 视口 `h-[715.154px]` 一致（设计 px） */
export const OTHER_WORKS_VIEWPORT_H = 715.154;

/**
 * 扇形弧走马灯（设计稿 px，随 ScaledViewport 等比到真实屏宽）
 *
 * 几何：圆心在视口**下方**（`fanCenterY` > 视口高度），主要看到圆周靠上的一小段弧；
 * 卡片 `rotate(θ) translateY(-R)`，底边沿切线 ⊥ 半径。
 *
 * `arcRadius` 过大时，穿过视口竖条的那段弧会整体偏到左右屏外（x 超出 `OTHER_WORKS_VIEWPORT_W`），会看不到图。
 */
export const OTHER_WORKS_FAN = {
  cardW: 563,
  cardH: 317,
  loopMs: 92_000,
  /** 圆半径（px）；略大则弧更平，须与视口宽/高一起保证圆与矩形有交集 */
  arcRadius: 2620,
  /**
   * 圆心相对本视口顶边的向下偏移（px）。
   * 须 **大于** `OTHER_WORKS_VIEWPORT_H`，圆心在视口底边之下。
   */
  fanCenterY: 2900,
  /** 动画起始相位（deg），把落在视口内的那段弧旋进画面 */
  initialAnimOffsetDeg: -52,
  panelCountMin: 8,
  panelCountMax: 22,
  /**
   * 角占位安全系数：越大整圈块数越少、弧上间距越大。
   * 卡片 `rotate(θ) translateY(-R)` 后实际占位略大于平面弦长估算，重叠时可略上调。
   */
  panelChordGapFactor: 1.346,
} as const;

/** 给定弧半径与卡片宽度，整圈最多放几块互不重叠的卡片 */
export function otherWorksFanMaxPanels(
  cardW: number,
  arcRadius: number,
  chordGapFactor: number,
): number {
  const half = (cardW * chordGapFactor) / 2;
  const angleRad = 2 * Math.atan(half / arcRadius);
  return Math.max(1, Math.floor((2 * Math.PI) / angleRad));
}

/**
 * 走马灯整圈 `panelCount` 个槽位分配封面下标，使**圆周上相邻**两块（含首尾相接）封面不同。
 *
 * 原先 `k % n` 在相隔 `n` 的槽位会重复同图，弧上多块可见时会出现「两张一样紧挨着」；
 * 当 `panelCount ≡ 1 (mod n)` 时首尾也会撞同一索引。本函数在仍用 `0..n-1` 轮换的前提下规避。
 */
export function otherWorksFanPanelImgIndices(
  panelCount: number,
  coverCount: number,
): number[] {
  const P = panelCount;
  const n = coverCount;
  if (P < 1) return [];
  if (n < 2) return Array.from({ length: P }, () => 0);
  if (P === 1) return [0];
  /** 2 色无法给奇环正常着色，只能交替（首尾仍会同色，极少 n=2） */
  if (n === 2 && P % 2 === 1) {
    return Array.from({ length: P }, (_, k) => k % 2);
  }

  if ((P - 1) % n !== 0) {
    return Array.from({ length: P }, (_, k) => k % n);
  }

  const q = (P - 1) / n;
  const out = new Array<number>(P);
  let idx = 0;
  for (let i = 0; i < q; i++) {
    for (let c = 0; c < n; c++) {
      out[idx++] = c;
    }
  }
  const prev = out[P - 2]!;
  const first = out[0]!;
  for (let c = 0; c < n; c++) {
    if (c !== prev && c !== first) {
      out[P - 1] = c;
      return out;
    }
  }
  return Array.from({ length: P }, (_, k) => k % n);
}
