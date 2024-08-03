import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { hasCookie } from "cookies-next";
import { TOKEN } from "@/constants";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
};

export default function Layout({ children }: { children?: React.ReactNode }) {
  if (!hasCookie(TOKEN, { cookies })) {
    redirect("/login");
  }

  return <div>{children}</div>;
}
