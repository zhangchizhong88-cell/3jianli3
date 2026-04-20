import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type CopyFn = (text: string) => Promise<void>;

const CopyToastContext = createContext<CopyFn | null>(null);

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(async (text: string) => {
    const ok = await writeClipboard(text);
    if (!ok) return;
    window.clearTimeout(hideTimer.current);
    setOpen(true);
    hideTimer.current = window.setTimeout(() => setOpen(false), 2200);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(hideTimer.current);
    },
    [],
  );

  const value = useMemo(() => copy, [copy]);

  const toast =
    open &&
    createPortal(
      <div
        className="pointer-events-none fixed bottom-10 left-1/2 z-[600] -translate-x-1/2 rounded-sm border border-white/50 bg-white/70 px-4 py-2 text-[13px] font-medium text-black shadow-lg backdrop-blur-md sm:text-[14px]"
        role="status"
        aria-live="polite"
      >
        复制成功
      </div>,
      document.body,
    );

  return (
    <CopyToastContext.Provider value={value}>
      {children}
      {toast}
    </CopyToastContext.Provider>
  );
}

export function useCopyToClipboard(): CopyFn {
  const ctx = useContext(CopyToastContext);
  if (!ctx) {
    throw new Error("useCopyToClipboard must be used within CopyToastProvider");
  }
  return ctx;
}

type CopyToClipboardProps = {
  text: string;
  className: string;
  children: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<"div">,
  "onClick" | "onKeyDown" | "role" | "tabIndex" | "children"
>;

export function CopyToClipboard({ text, className, children, ...rest }: CopyToClipboardProps) {
  const copy = useCopyToClipboard();

  return (
    <div
      {...rest}
      role="button"
      tabIndex={0}
      className={`cursor-pointer select-none outline-none transition-[opacity,transform] duration-150 hover:opacity-95 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#d4ff5b]/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${className}`}
      onClick={() => void copy(text)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void copy(text);
        }
      }}
    >
      {children}
    </div>
  );
}
