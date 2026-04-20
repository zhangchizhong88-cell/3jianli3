#!/usr/bin/env node
/**
 * 扫描 public/other-works-covers/cover-NN/，生成：
 *   • src/generated/otherWorksCoverUrls.ts     — 走马灯封面（图或视频）
 *   • src/generated/otherWorksLightboxInner.ts — 灯箱内页（图或视频，可多张）
 *
 * 运行：npm run dev / npm run build 会自动执行；也可 node scripts/generate-other-works-inner.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "public", "other-works-covers");
const outDir = path.join(root, "src", "generated");
const outInner = path.join(outDir, "otherWorksLightboxInner.ts");
const outCover = path.join(outDir, "otherWorksCoverUrls.ts");

const mediaExt = String.raw`(?:png|jpe?g|webp|mp4|webm|mov)`;

const isMainDetail = (f) => new RegExp(`^detail\\.${mediaExt}$`, "i").test(f);
const isNumberedDetail = (f) =>
  new RegExp(`^detail[-_]?\\d+\\.${mediaExt}$`, "i").test(f);

function isDetailAsset(f) {
  return isMainDetail(f) || isNumberedDetail(f);
}

function coverIndexFromDir(name) {
  const m = /^cover-(\d{2})$/.exec(name);
  if (!m) return null;
  return Number.parseInt(m[1], 10) - 1;
}

function sortDetailFiles(files) {
  return [...files].sort((a, b) => {
    const ma = isMainDetail(a);
    const mb = isMainDetail(b);
    if (ma && !mb) return -1;
    if (!ma && mb) return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  });
}

/** 与走马灯「主封面」同名的视频；若主封面选了静态图，这些可追加进灯箱内页 */
const COVER_VIDEO_CANDIDATES = ["cover.mp4", "cover.webm", "cover.mov"];

function supplementalCoverVideos(dirPath, chosenCoverFile) {
  const out = [];
  for (const name of COVER_VIDEO_CANDIDATES) {
    if (name === chosenCoverFile) continue;
    if (fs.existsSync(path.join(dirPath, name))) out.push(name);
  }
  return out;
}

function collectInner() {
  /** @type {Record<number, string[]>} */
  const map = Object.create(null);
  if (!fs.existsSync(base)) return map;

  for (const ent of fs.readdirSync(base, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const idx = coverIndexFromDir(ent.name);
    if (idx == null || idx < 0) continue;

    const dirPath = path.join(base, ent.name);
    const chosenCover = pickCoverFilename(dirPath);
    const detailFiles = sortDetailFiles(
      fs.readdirSync(dirPath).filter((f) => isDetailAsset(f)),
    );
    const extraVideos = chosenCover
      ? supplementalCoverVideos(dirPath, chosenCover)
      : [];
    const files = [...detailFiles, ...extraVideos];
    if (files.length === 0) continue;

    map[idx] = files.map((f) =>
      encodeURI(`/other-works-covers/${ent.name}/${f}`),
    );
  }
  return map;
}

function pickCoverFilename(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  /**
   * 同目录多种文件时：走马灯 / 灯箱顶图优先用静态图，避免「补一个 cover.mp4」误顶掉封面。
   * 仅视频时仍可选 cover.mp4 等；与静态图同存的 cover.* 视频会由 collectInner 追加进内页。
   */
  const order = [
    "cover.png",
    "cover.jpg",
    "cover.jpeg",
    "cover.webp",
    "cover.mp4",
    "cover.webm",
    "cover.mov",
  ];
  for (const name of order) {
    if (fs.existsSync(path.join(dirPath, name))) return name;
  }
  return null;
}

function listCoverDirNames() {
  if (!fs.existsSync(base)) return [];
  /** @type {{ name: string; n: number }[]} */
  const found = [];
  for (const ent of fs.readdirSync(base, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const m = /^cover-(\d{2})$/.exec(ent.name);
    if (!m) continue;
    found.push({ name: ent.name, n: Number.parseInt(m[1], 10) });
  }
  found.sort((a, b) => a.n - b.n);
  if (found.length === 0) return [];
  for (let i = 0; i < found.length; i += 1) {
    if (found[i].n !== i + 1) {
      throw new Error(
        `[generate-other-works-inner] cover 须从 cover-01 连续编号（cover-01、cover-02…），当前：${found.map((x) => x.name).join(", ")}`,
      );
    }
  }
  return found.map((x) => x.name);
}

function collectCoverUrls() {
  const dirs = listCoverDirNames();
  if (dirs.length === 0) {
    throw new Error(
      `[generate-other-works-inner] 未找到 public/other-works-covers/cover-01 等文件夹`,
    );
  }
  const urls = [];
  for (const dir of dirs) {
    const dirPath = path.join(base, dir);
    const file = pickCoverFilename(dirPath);
    if (!file) {
      throw new Error(
        `[generate-other-works-inner] 缺少封面文件：在 ${path.relative(root, dirPath)} 放入 cover.mp4 或 cover.png 等之一（见 public/other-works-covers/资源说明.txt）`,
      );
    }
    urls.push(encodeURI(`/other-works-covers/${dir}/${file}`));
  }
  return urls;
}

function emitInner(map) {
  const keys = Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b);
  const entries = keys.map((k) => {
    const urls = map[k];
    const lines = urls.map((u) => `    ${JSON.stringify(u)},`).join("\n");
    return `  ${k}: [\n${lines}\n  ] as const`;
  });
  const body = entries.length ? `${entries.join(",\n")},\n` : "";
  const content = `/**
 * 自动生成：内页 = detail*.（图或视频）+ 未用作主封面的 cover.{mp4,webm,mov}
 * 规则见 public/other-works-covers/资源说明.txt
 */
export const OTHER_WORK_COVER_LIGHTBOX_INNER: Partial<
  Record<number, readonly string[]>
> = {
${body}};
`;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outInner, content, "utf8");
}

function emitCover(urls) {
  const lines = urls.map((u) => `  ${JSON.stringify(u)},`).join("\n");
  const content = `/**
 * 自动生成：主封面优先 cover.png… 再 cover.mp4…（见脚本 pickCoverFilename）
 */
export const OTHER_WORKS_COVER_URLS: readonly string[] = [
${lines}
] as const;
`;

  fs.writeFileSync(outCover, content, "utf8");
}

const innerMap = collectInner();
const coverUrls = collectCoverUrls();
emitInner(innerMap);
emitCover(coverUrls);

console.log(
  `[generate-other-works-inner] covers → ${path.relative(root, outCover)}`,
);
console.log(
  `[generate-other-works-inner] inner  → ${path.relative(root, outInner)} (${Object.keys(innerMap).length} slot(s))`,
);
