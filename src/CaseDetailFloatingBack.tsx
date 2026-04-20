import { useViewportDesignScale } from "./ViewportScaleContext";

const imgCaseDetailBackArrow =
  "/figma-assets/b691f008-b663-4a88-b515-a83dd689d402.svg";

type CaseDetailFloatingBackProps = {
  onClose: () => void;
};

/** 设计稿 50,134 / 80px；fixed 在视口，随窗口与缩放系数对齐画布左上角 */
export function CaseDetailFloatingBack({ onClose }: CaseDetailFloatingBackProps) {
  const scale = useViewportDesignScale();
  const s = scale;
  const size = 80 * s;
  const left = 50 * s;
  const top = 134 * s;

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed z-[280] bg-[#d4ff5b] p-0 outline-none ring-offset-2 ring-offset-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-white"
      style={{
        left,
        top,
        width: size,
        height: size,
        borderTopLeftRadius: 4 * s,
        borderTopRightRadius: 4 * s,
        borderBottomLeftRadius: 4 * s,
        borderBottomRightRadius: 16 * s,
      }}
      data-node-id="1169:630"
      aria-label="返回简历主页"
    >
      <span className="absolute inset-[22.5%]" data-node-id="1169:631">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src={imgCaseDetailBackArrow}
        />
      </span>
    </button>
  );
}
