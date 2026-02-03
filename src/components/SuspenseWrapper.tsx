import React, { Suspense } from "react";
import { PageLoader } from "./PageLoader";

export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}
