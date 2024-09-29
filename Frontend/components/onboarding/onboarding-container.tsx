export default function OnboardingContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[url('/onboarding-bg.svg')] min-h-dvh flex items-center justify-center">
      <div className="rounded-3xl bg-white my-8">{children}</div>
    </div>
  );
}
