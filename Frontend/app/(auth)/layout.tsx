import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasCookie } from "cookies-next";
import Image from "next/image";
import { TOKEN, USER_ID } from "@/constants";
import loginIllustration from "@/public/auth-bg.svg";

export default function AuthLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  if (hasCookie(TOKEN, { cookies }) && hasCookie(USER_ID, { cookies })) {
    redirect("/servers");
  }

  return (
    <div className="flex items-center justify-around sm:gap-3 sm:px-4 lg:px-16 w-full min-h-dvh">
      <div className="">{children}</div>
      <div className="relative py-8 hidden lg:block">
        <Image
          draggable={false}
          className="hidden lg:block h-[90dvh]"
          alt=""
          src={loginIllustration}
        />
      </div>
    </div>
  );
}
