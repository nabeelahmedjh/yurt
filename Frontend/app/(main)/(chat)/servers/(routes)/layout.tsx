"use client";
import ChatLayout from "@/components/chat/chat-layout";
import React from "react";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <main className="h-[100dvh]">
        <ChatLayout />
      </main>
      {children}
    </>
  );
}
