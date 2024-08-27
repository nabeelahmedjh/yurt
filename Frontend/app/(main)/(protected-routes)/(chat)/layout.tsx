"use client";

import ChatLayout from "@/components/chat/chat-layout";
import { emitIdentity } from "@/lib/emit-identity";

export default function Layout({ children }: { children?: React.ReactNode }) {
  emitIdentity();

  return (
    <>
      <main className="h-[100dvh]">
        <ChatLayout />
      </main>
      {children}
    </>
  );
}
