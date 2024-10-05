import { Suspense } from "react";
import OnboardingContainer from "@/components/onboarding/onboarding-container";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContainer>{children}</OnboardingContainer>
    </Suspense>
  );
}
