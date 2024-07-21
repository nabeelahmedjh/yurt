"use client";
import ChatLayout from "@/components/chat/chat-layout";
import { useEffect, useState } from "react";

import { socket } from "@/app/socket-client";
import { getData } from "@/lib/get-data";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [profileId, setProfileId] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);

    async function getProfile() {
      const profileData = await getData("/auth/profile");
      setProfileId(profileData.user._id);
    }
    getProfile();

    if (isMounted && profileId) {
      if (!sessionStorage.getItem("isIdentitySent")) {
        socket.emit("identity", profileId);

        sessionStorage.setItem("isIdentitySent", "true");
      }
    }
  }, [isMounted, profileId]);

  return (
    <>
      <main className="h-[100dvh]">
        <ChatLayout />
      </main>
      {children}
    </>
  );
}
