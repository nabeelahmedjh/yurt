import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasCookie } from "cookies-next";

export default function AuthLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  if (hasCookie("authToken", { cookies })) {
    redirect("/servers");
  }

  return (
    <div className="flex justify-center items-center w-full min-h-dvh bg-gradient-to-bl from-emerald-300 to-teal-500">
      {children}
    </div>
  );
}
