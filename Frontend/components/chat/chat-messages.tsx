"use client";

import { useParams } from "next/navigation";
import MessageItem from "@/components/chat/chat-message-item";
import { PhotoProvider } from "react-photo-view";
import "@/app/react-photo-view.css";
import { format, isSameDay } from "date-fns";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatMessages({
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
        scrollArea.scrollTop += currentScrollHeight - previousHeight;
      }

      previousHeightRef.current = currentScrollHeight;
    }
  }, [messages, isLoadingMore, scrollAreaRef]);

  if (!params?.serverID || !params?.spaceID) return "";

  return (
    <PhotoProvider className="h-full" maskOpacity={0.9}>
      <div ref={scrollAreaRef} className="p-4 h-full overflow-y-auto relative">
        {isLoadingMore && (
          <div className="w-full flex justify-center font-medium p-6">
            <Loader className="animate-spin animate" />
          </div>
        )}
        {params?.spaceID &&
          messages?.map((message: any, index: number) => {
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
                <MessageItem
                  currentDate={currentDate}
                  img={message.sentBy.avatar}
                  content={message.content}
                  attachment={message.attachment}
                  name={
                    message?.sentBy?.username
                      ? message?.sentBy?.username
                      : message?.sentBy?.email ?? "User"
                  }
                />
              </li>
            );
          })}

        <div className="h-px" ref={messagesEndRef}></div>
      </div>
    </PhotoProvider>
  );
}
