import { Suspense } from "react";
import RedirectContainer from "@/components/redirect-container";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectContainer>{children}</RedirectContainer>
    </Suspense>
  );
}
