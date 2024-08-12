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
    <div className="flex items-center justify-around min-h-dvh gap-3 mx-4 lg:mx-16">
      <div className="">{children}</div>
      <Image
        draggable={false}
        className="h-[90vh] hidden lg:block"
        alt=""
        src={loginIllustration}
      />
    </div>
  );
}
