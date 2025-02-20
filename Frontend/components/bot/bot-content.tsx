"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import BotChatHeader from "@/components/bot/bot-header";
import BotChatMessages from "@/components/bot/bot-messages";
import BotChatInput from "@/components/bot/bot-input";
import useGetBotMessages from "@/components/bot/useGetBotMessages";
import { useDebounce } from "use-debounce";
import { ChevronDownCircleIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export default function BotChatContent() {
  const { messages, isLoadingMore, isReachingEnd, setSize } =
    useGetBotMessages();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [debouncedSetSize] = useDebounce(setSize, 200);
  const isOnDesktop = useMediaQuery("(min-width: 1024px)");

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) return;

    const distanceFromBottom =
      scrollArea.scrollHeight -
      (scrollArea.scrollTop + scrollArea.clientHeight);

    const threshold = 100; // Threshold for showing 'scroll to bottom' button
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

    // If the user is close to the bottom, scroll them to the bottom
    const threshold = isOnDesktop ? 3000 : 3000;

    if (distanceFromBottom < threshold) {
      scrollArea?.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isOnDesktop]);

  return (
    <div className="mx-1 h-full flex flex-col relative bg-neutral-100 rounded-t-3xl">
      <BotChatHeader setIsOpen={setIsOpen} isOpen={isOpen} />
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, minHeight: 0 }}
        animate={{
          height: isOpen ? "calc(100dvh - 250px)" : 0,
          minHeight: isOpen ? "calc(100dvh - 250px)" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <BotChatMessages
          messagesEndRef={messagesEndRef}
          isLoadingMore={isLoadingMore}
          scrollAreaRef={scrollAreaRef}
          messages={messages}
        />
        {!isAtBottom && isOpen && (
          <span
            onClick={() => {
              scrollAreaRef.current?.scrollTo({
                top: scrollAreaRef.current?.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="bg-primary rounded-full p-1 absolute right-4 bottom-16 cursor-pointer"
          >
            <ChevronDownCircleIcon />
          </span>
        )}
      </motion.div>
      <motion.div
        className="overflow-hidden"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <BotChatInput scrollToBottomRef={messagesEndRef} />
      </motion.div>
    </div>
  );
}
