"use client";

import ChatLayout from "@/components/chat/chat-layout";
import { socket } from "@/app/socket-client";
import useGetProfile from "@/hooks/useGetProfile";
export default function Layout({ children }: { children?: React.ReactNode }) {
  const { data: profileData } = useGetProfile();

  const profileId = profileData?.user?._id;

  if (profileId) {
    if (!sessionStorage.getItem("isIdentitySent")) {
      socket.emit("identity", profileId);

      sessionStorage.setItem("isIdentitySent", "true");
    }
  }

  return (
    <>
      <main className="h-[100dvh]">
        <ChatLayout />
      </main>
      {children}
    </>
  );
}
