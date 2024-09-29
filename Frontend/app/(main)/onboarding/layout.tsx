import OnboardingContainer from "@/components/onboarding/onboarding-container";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingContainer>{children}</OnboardingContainer>;
}
