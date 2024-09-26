"use client";

import ChatLayout from "@/components/chat/chat-layout";
import ChatMobileLayout from "@/components/chat/chat-mobile-layout";

import { emitIdentity } from "@/lib/emit-identity";
import { useMediaQuery, useIsClient } from "usehooks-ts";

export default function Layout({ children }: { children?: React.ReactNode }) {
  emitIdentity();
  const isClient = useIsClient();
  const desktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      <main className="h-[100dvh]">
        {isClient ? desktop ? <ChatLayout /> : <ChatMobileLayout /> : null}
      </main>
      {children}
    </>
  );
}
