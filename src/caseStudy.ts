export type CaseSlug = "pp-voice" | "tiya" | "lizhi-podcast";

/** 内页顶栏与 Monument 标题文案（对齐 Figma 1169:610 结构） */
export type CaseDetailNav = {
  indexLabel: string;
  centerLabel: string;
  rightTag: string;
  /** `whitespace-pre-wrap`，可用 `//` 作视觉分隔 */
  heroMonumentText: string;
};

export const CASE_DETAIL_NAV: Record<CaseSlug, CaseDetailNav> = {
  "pp-voice": {
    indexLabel: "00.1",
    centerLabel: "PP Voice Brand Upgrade",
    rightTag: "UI / UX",
    heroMonumentText: "PP Voice Brand  //   Upgrade",
  },
  tiya: {
    indexLabel: "00.2",
    centerLabel: "Tiya · Gen Z Social",
    rightTag: "UI / UX",
    /** Figma 1170:637 */
    heroMonumentText: "Tiya · Gen Z _Social",
  },
  "lizhi-podcast": {
    indexLabel: "00.3",
    centerLabel: "Lizhi Podcast App",
    rightTag: "UI / UX",
    /** Figma 1170:638 */
    heroMonumentText: "Lizhi Podcast  ·  UI Design",
  },
};

function sliceImagePaths(folder: string, from: number, to: number): string[] {
  const paths: string[] = [];
  for (let n = from; n <= to; n += 1) {
    paths.push(encodeURI(`/cases/${folder}/Slice ${n}.png`));
  }
  return paths;
}

export const CASE_CONFIG: Record<
  CaseSlug,
  { title: string; images: string[] }
> = {
  "pp-voice": {
    title: "PP语音 - 品牌升级",
    images: sliceImagePaths("pp-voice", 7, 16),
  },
  tiya: {
    title: "TiYA - Z世代社交App设计",
    images: sliceImagePaths("tiya", 17, 29),
  },
  "lizhi-podcast": {
    title: "荔枝播客 - 专业播客平台设计",
    images: sliceImagePaths("lizhi-podcast", 1, 6),
  },
};
