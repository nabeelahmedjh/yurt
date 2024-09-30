"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import useGetMessages from "@/hooks/useGetMessages";
import { useDebounce } from "use-debounce";
import { ChevronDownCircleIcon } from "lucide-react";

export default function ChatContent() {
  const { messages, isLoadingMore, isReachingEnd, setSize } = useGetMessages();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const [debouncedSetSize] = useDebounce(setSize, 200);

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const showScrollToBottomButton = (scrollArea: HTMLElement) => {
      const threshold = 200; // in pixels
      const distanceFromBottom =
        scrollArea.scrollHeight -
        (scrollArea.scrollTop + scrollArea.clientHeight);

      return distanceFromBottom < threshold;
    };

    setIsAtBottom(showScrollToBottomButton(scrollArea));

    if (!scrollArea || isLoadingMore || isReachingEnd) return;

    if (scrollArea.scrollTop <= 100) {
      debouncedSetSize((prevSize: any) => prevSize + 1);
    }

    const threshold = 50;
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
    const scrollArea = scrollAreaRef.current;
    if (!isUserScrolling && initialLoad) {
      // console.log("scroll to bottom 1");

      scrollArea?.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });

      setInitialLoad(false);
    }
  }, [messages, isUserScrolling, initialLoad]);

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
