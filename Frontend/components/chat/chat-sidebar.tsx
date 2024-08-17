import React from "react";

import ChatServers from "@/components/chat/chat-servers";
import ChatSpaces from "@/components/chat/chat-spaces";
import { useParams } from "next/navigation";

export default function ChatSidebar({
  isWhiteboardOpen,
}: {
  isWhiteboardOpen: any;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();

  return (
    <div className="flex">
      <ChatServers />
      {params?.serverID && <ChatSpaces isWhiteboardOpen={isWhiteboardOpen} />}
    </div>
  );
}
