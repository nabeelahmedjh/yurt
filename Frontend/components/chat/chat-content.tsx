import React from "react";

import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatContent() {
  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader />
      <ScrollArea className="flex-1 overflow-y-auto">
        <ChatMessages />
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
