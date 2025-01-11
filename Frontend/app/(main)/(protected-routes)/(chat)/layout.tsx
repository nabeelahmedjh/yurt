"use client";

import ChatLayout from "@/components/chat/chat-layout";
import ChatMobileLayout from "@/components/chat/chat-mobile-layout";
import useGetProfile from "@/hooks/user/useGetProfile";
import { useMediaQuery, useIsClient } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { TOKEN, USER_ID } from "@/constants";
import SplashScreen from "@/components/splash-screen";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const isClient = useIsClient();
  const desktop = useMediaQuery("(min-width: 1024px)");

  const { data, isLoading, error } = useGetProfile();
  console.log(data);

  if (isLoading) return <SplashScreen />;

  if (error) {
    console.log(error);
    deleteCookie(TOKEN);
    deleteCookie(USER_ID);
    router.refresh();
    return <SplashScreen />;
  }

  if (!isLoading && !data._id) {
    console.log("User not found");
    deleteCookie(TOKEN);
    deleteCookie(USER_ID);
    router.refresh();
    return <SplashScreen />;
  }

  return (
    <>
      <main className="h-[100dvh]">
        {isClient ? desktop ? <ChatLayout /> : <ChatMobileLayout /> : null}
      </main>
      {children}
    </>
  );
}
