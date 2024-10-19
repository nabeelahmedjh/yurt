"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import BotChatHeader from "@/components/bot/bot-header";
import BotChatMessages from "@/components/bot/bot-messages";
import BotChatInput from "@/components/bot/bot-input";
import useGetMessages from "@/hooks/useGetMessages";
import { useDebounce } from "use-debounce";
import { ChevronDownCircleIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export default function BotChatContent() {
  const { messages, isLoadingMore, isReachingEnd, setSize } = useGetMessages();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isOpen, setIsOpen] = useState(true); // State to manage chat visibility

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

    // If the user is close to the bottom, scroll them to the bottom
    const threshold = isOnDesktop ? 500 : 1500;
    if (distanceFromBottom < threshold) {
      scrollArea?.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isOnDesktop, messages]);

  return (
    <div className="px-1 h-full flex flex-col relative bg-white">
      <button
        className="w-full"
        onClick={() => setIsOpen((prev) => !prev)} // Toggle chat visibility
      >
        <BotChatHeader />
      </button>
      <motion.div
        className="overflow-hidden" // Hide overflow
        initial={{ height: 0 }} // Start with height 0
        animate={{ height: isOpen ? "auto" : 0 }} // Animate height based on isOpen
        transition={{ duration: 0.3 }} // Duration of the animation
      >
        <BotChatMessages
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0, height: 0 }} // Start with height 0 and opacity 0
        animate={{
          opacity: isOpen ? 1 : 0, // Animate opacity based on isOpen
          height: isOpen ? "auto" : 0, // Animate height based on isOpen
        }}
        transition={{ duration: 0.3 }} // Duration of the animation
      >
        <BotChatInput scrollToBottomRef={messagesEndRef} />
      </motion.div>
    </div>
  );
}
