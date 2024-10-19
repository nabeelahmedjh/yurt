"use client";

import { useParams } from "next/navigation";
import BotMessageItem from "@/components/bot/bot-message-item";
import { format, isSameDay } from "date-fns";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const params = useParams<{ serverID: string; spaceID: string }>();
  const previousHeightRef = useRef(0);

  let previousDate: Date | null = null;

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

  if (!params?.serverID || !params?.spaceID) return "";

  return (
    <div ref={scrollAreaRef} className="p-4 h-full overflow-y-auto relative">
      {isLoadingMore && (
        <div className="w-full flex justify-center font-medium p-6">
          <Loader className="animate-spin animate" />
        </div>
      )}
      {messages?.map((message: any, index: number) => {
        const currentDate = new Date(message.createdAt);
        const showDateStamp =
          !previousDate || !isSameDay(currentDate, previousDate);
        previousDate = currentDate;

        return (
          <li className="list-none" key={message._id}>
            {showDateStamp && (
              <div className="text-sm text-center text-gray-500 py-1 my-4 rounded-lg">
                <span className="bg-slate-100 p-2 rounded-lg">
                  {format(currentDate, "MMMM d, yyyy")}
                </span>
              </div>
            )}
            <BotMessageItem
              sentBy={message.sentBy}
              currentDate={currentDate}
              img={message.sentBy.avatar?.source}
              content={message.content}
              name={
                message?.sentBy?.username
                  ? message?.sentBy?.username
                  : message?.sentBy?.email ?? "Bot"
              }
            />
          </li>
        );
      })}

      <div className="h-px" ref={messagesEndRef}></div>
    </div>
  );
}
