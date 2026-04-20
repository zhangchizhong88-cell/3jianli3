/**
 * 「What I Do」底部工具带：本地 PNG 切图（@3x，180px 高）按设计稿 60px 高显示 + 无缝跑马灯。
 * 走马灯展示顺序见 {@link MARQUEE_ITEMS}；`slice-04` = CURSOR、`slice-05` = After Effects、`slice-06` = Gemini；`slice-07` / `slice-08` 为后补切图。
 */
type MarqueeItem = {
  src: string;
  alt: string;
  /**
   * 切图矩形框与「肉眼看到的 Logo」垂直重心不一致时微调（负值上移）。
   * Gemini（`slice-06`）相对画布略偏下，故单独上移。
   */
  translateYClass?: string;
};

const MARQUEE_ITEMS: MarqueeItem[] = [
  { src: "/tools-marquee/slice-01.png", alt: "Sketch" },
  { src: "/tools-marquee/slice-02.png", alt: "Figma" },
  { src: "/tools-marquee/slice-03.png", alt: "即梦 AI" },
  {
    src: "/tools-marquee/slice-06.png",
    alt: "Gemini",
    translateYClass: "-translate-y-[10px]",
  },
  { src: "/tools-marquee/slice-04.png", alt: "CURSOR" },
  { src: "/tools-marquee/slice-05.png", alt: "After Effects" },
  { src: "/tools-marquee/slice-07.png", alt: "Midjourney · Claude" },
  { src: "/tools-marquee/slice-08.png", alt: "ChatGPT · Claude" },
];

function MarqueeSegment({ segmentKey }: { segmentKey: string }) {
  return (
    <div className="flex shrink-0 items-center gap-[150px] pr-[150px]">
      {MARQUEE_ITEMS.map((item, i) => (
        <img
          key={`${segmentKey}-${i}`}
          src={item.src}
          alt={item.alt}
          className={[
            "h-[60px] w-auto shrink-0 object-contain",
            item.translateYClass,
          ]
            .filter(Boolean)
            .join(" ")}
          draggable={false}
        />
      ))}
    </div>
  );
}

export function ToolsMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden py-[14px]"
      data-name="Tools marquee"
    >
      <div className="tools-marquee-track flex w-max">
        <MarqueeSegment segmentKey="a" />
        <MarqueeSegment segmentKey="b" />
      </div>
    </div>
  );
}
