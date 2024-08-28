"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import useGetMessages from "@/hooks/useGetMessages";
import { useDebounce } from "use-debounce";

export default function ChatContent() {
  const { messages, isLoadingMore, isReachingEnd, setSize } = useGetMessages();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const [debouncedSetSize] = useDebounce((size: any) => setSize(size), 200);

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || isLoadingMore || isReachingEnd) return;

    if (scrollArea.scrollTop <= 0) {
      console.log("scrollArea.scrollTop", scrollArea.scrollTop);

      debouncedSetSize((prevSize: any) => prevSize + 1);
    }

    const threshold = 0;
    if (scrollArea.scrollTop <= threshold) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }
  }, [debouncedSetSize, isLoadingMore, isReachingEnd]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader />
      <ChatMessages
        isLoadingMore={isLoadingMore}
        scrollAreaRef={scrollAreaRef}
        messageContainerRef={messagesEndRef}
        messages={messages}
      />
      <ChatInput scrollToBottomRef={messagesEndRef} />
    </div>
  );
}
