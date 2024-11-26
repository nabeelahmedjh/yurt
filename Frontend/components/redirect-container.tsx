"use client";

import { useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { TOKEN, USER_ID } from "@/constants";

export default function RedirectContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  if (!token || !userId) {
    return (
      <div className="w-full h-dvh flex flex-col gap-8 justify-center items-center bg-black">
        <h1 className="text-4xl text-white">You seem to be lost</h1>
        <a className="text-white text-xl underline" href="/">
          Return Home
        </a>
      </div>
    );
  }

  setCookie(TOKEN, token);
  setCookie(USER_ID, userId);

  return (
    <div className="bg-[url('/onboarding-bg.svg')] min-h-dvh flex items-center justify-center">
      <div className="rounded-3xl bg-white my-8">{children}</div>
    </div>
  );
}
