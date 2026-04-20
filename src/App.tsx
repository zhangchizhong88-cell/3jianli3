import { useState } from "react";
import { CaseDetailPage } from "./CaseDetailPage";
import { CopyToastProvider } from "./CopyToast";
import { MobileReloadDebugOverlay } from "./MobileReloadDebugOverlay";
import { ResumePage } from "./ResumePage";
import { ViewportScaleProvider } from "./ViewportScaleContext";
import type { CaseSlug } from "./caseStudy";

export default function App() {
  const [caseSlug, setCaseSlug] = useState<CaseSlug | null>(null);

  return (
    <CopyToastProvider>
      <ViewportScaleProvider>
        <ResumePage
          onOpenCase={setCaseSlug}
          suppressHeroChrome={caseSlug != null}
        />
        <MobileReloadDebugOverlay />
        {caseSlug ? (
          <CaseDetailPage slug={caseSlug} onClose={() => setCaseSlug(null)} />
        ) : null}
      </ViewportScaleProvider>
    </CopyToastProvider>
  );
}
