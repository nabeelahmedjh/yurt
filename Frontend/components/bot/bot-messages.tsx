"use client";

import BotMessageItem from "@/components/bot/bot-message-item";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

// for testing only
import { botMarkdown } from "./bot-makrdown";

export default function BotChatMessages({
  messages,
  scrollAreaRef,
  isLoadingMore,
  messagesEndRef,
}: {
  messages?: any;
  scrollAreaRef?: any;
  isLoadingMore?: boolean;
  messagesEndRef?: any;
}) {
  const previousHeightRef = useRef(0);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea && !isLoadingMore) {
      const currentScrollHeight = scrollArea.scrollHeight;
      const scrollTop = scrollArea.scrollTop;
      const previousHeight = previousHeightRef.current;

      if (scrollTop < 100) {
        // console.log("scroll to bottom 2");

        scrollArea.scrollTop += currentScrollHeight - previousHeight;
      }

      // console.log("scroll to bottom 2.1", currentScrollHeight, previousHeight);
      previousHeightRef.current = currentScrollHeight;
    }
  }, [messages, isLoadingMore, scrollAreaRef]);

  return (
    <div ref={scrollAreaRef} className="p-4 h-full overflow-y-auto relative">
      {isLoadingMore && (
        <div className="w-full flex justify-center font-medium p-6">
          <Loader className="animate-spin animate" />
        </div>
      )}
      {messages?.map((message: any, index: number) => {
        return (
          <li className="list-none" key={message._id}>
            <BotMessageItem content={message.content} role={message.role} />
          </li>
        );
      })}

      <div className="h-px" ref={messagesEndRef}></div>
    </div>
  );
}
