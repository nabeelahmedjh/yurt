import React, { useState, useRef, useEffect } from "react";

import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatContent() {
  const [messages, setMessages] = useState<object[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  };

  return (
    <div className="bg-white flex flex-col h-dvh">
      <ChatHeader />
      <ScrollArea className="flex-1 overflow-y-auto">
        <ChatMessages
          messageContainerRef={messagesEndRef}
          messages={messages}
          setMessages={setMessages}
        />
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
