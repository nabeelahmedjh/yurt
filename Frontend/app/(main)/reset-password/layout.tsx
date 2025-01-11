import { Suspense } from "react";
import RedirectContainer from "@/components/redirect-container";

export default function ResetPasswordLayout({
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
