"use client";

import BotMessageItem from "@/components/bot/bot-message-item";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BotChatMessages({
  messages,
  scrollAreaRef,
  isLoadingMore,
  messagesEndRef,
}: {
  messages?: any;
  scrollAreaRef?: React.RefObject<HTMLDivElement>;
  isLoadingMore?: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}) {
  const previousHeightRef = useRef(0);
  const latestMessageRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef?.current;
    if (scrollArea && !isLoadingMore) {
      const currentScrollHeight = scrollArea.scrollHeight;
      const previousHeight = previousHeightRef.current;

      // Scroll to the latest bot message if available
      if (latestMessageRef.current) {
        latestMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start", // Aligns to the beginning of the message item
        });
      }

      previousHeightRef.current = currentScrollHeight;
    }
  }, [messages, isLoadingMore, scrollAreaRef]);

  return (
    <div
      ref={scrollAreaRef}
      className="p-4 h-full overflow-y-auto relative custom-scrollbar"
    >
      {isLoadingMore && (
        <div className="w-full flex justify-center font-medium p-6">
          <Loader className="animate-spin animate" />
        </div>
      )}
      {messages?.map((message: any, index: number) => {
        const isLatestMessage = index === messages.length - 1;
        return (
          <li
            className="list-none"
            key={message._id}
            ref={isLatestMessage ? latestMessageRef : undefined}
          >
            <BotMessageItem content={message.content} role={message.role} />
          </li>
        );
      })}

      <div className="h-px" ref={messagesEndRef}></div>
    </div>
  );
}
