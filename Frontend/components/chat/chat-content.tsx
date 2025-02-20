"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import useGetMessages from "@/hooks/useGetMessages";
import { useDebounce } from "use-debounce";
import { ChevronDownCircleIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export default function ChatContent() {
  const { messages, isLoadingMore, isReachingEnd, setSize } = useGetMessages();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [debouncedSetSize] = useDebounce(setSize, 200);

  const isOnDesktop = useMediaQuery("(min-width: 1024px)");

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const distanceFromBottom =
      scrollArea.scrollHeight -
      (scrollArea.scrollTop + scrollArea.clientHeight);

    const threshold = 300; // Threshold for showing 'scroll to bottom' button

    setIsAtBottom(distanceFromBottom < threshold);

    if (isLoadingMore || isReachingEnd) return;

    // Load more messages when scrolling close to the top
    if (scrollArea.scrollTop <= 100) {
      debouncedSetSize((prevSize: any) => prevSize + 1);
    }

    // Set user scrolling state based on their scroll position
    const userScrollThreshold = 300;
    setIsUserScrolling(distanceFromBottom > userScrollThreshold);
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
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const distanceFromBottom =
      scrollArea?.scrollHeight -
      (scrollArea?.scrollTop + scrollArea?.clientHeight);

    // If the user is close to the bottom , scroll them to the bottom
    const threshold = isOnDesktop ? 300 : 1000;
    if (distanceFromBottom < threshold) {
      scrollArea?.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isOnDesktop, messages]);

  return (
    <div className="flex flex-col h-dvh relative bg-white">
      <ChatHeader />
      <ChatMessages
        messagesEndRef={messagesEndRef}
        isLoadingMore={isLoadingMore}
        scrollAreaRef={scrollAreaRef}
        messages={messages}
      />
      {!isAtBottom && (
        <span
          onClick={() => {
            scrollAreaRef.current?.scrollTo({
              top: scrollAreaRef.current?.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="bg-primary rounded-full p-1 absolute right-8 bottom-24 cursor-pointer"
        >
          <ChevronDownCircleIcon />
        </span>
      )}
      <ChatInput scrollToBottomRef={messagesEndRef} />
    </div>
  );
}
