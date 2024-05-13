import React from "react";

import ChatServers from "@/components/chat/chat-servers";
import ChatSpaces from "@/components/chat/chat-spaces";

export default function ChatSidebar() {
  return (
    <div className="flex">
      <ChatServers />
      <ChatSpaces />
    </div>
  );
}
