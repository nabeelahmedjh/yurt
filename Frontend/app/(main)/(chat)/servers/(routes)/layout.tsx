"use client";

import ChatLayout from "@/components/chat/chat-layout";
import useGetProfile from "@/hooks/useGetProfile";
import SocketService from "@/services/SocketService";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { data: profileData } = useGetProfile();

  const profileId = profileData?.user?._id;

  if (profileId) {
    const socket = SocketService.connect();
    socket.emit("identity", profileId);

    sessionStorage.setItem("isIdentitySent", "true");
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
