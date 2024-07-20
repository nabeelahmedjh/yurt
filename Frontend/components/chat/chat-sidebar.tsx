import React from "react";

import ChatServers from "@/components/chat/chat-servers";
import ChatSpaces from "@/components/chat/chat-spaces";

export default function ChatSidebar({
  isWhiteboardOpen,
}: {
  isWhiteboardOpen: any;
}) {
  return (
    <div className="flex">
      <ChatServers />
      <ChatSpaces isWhiteboardOpen={isWhiteboardOpen} />
    </div>
  );
}
