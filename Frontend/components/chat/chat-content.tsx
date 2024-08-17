"use client";

import { useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMessages from "@/hooks/useGetMessages";
import { useParams, useRouter } from "next/navigation";

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

export default function ChatContent() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useGetMessages();

  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

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
    <div className="flex flex-col h-dvh">
      <ChatHeader />
      <ScrollArea className="flex-1 overflow-y-auto">
        <ChatMessages
          messageContainerRef={messagesEndRef}
          messages={messages}
        />
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
