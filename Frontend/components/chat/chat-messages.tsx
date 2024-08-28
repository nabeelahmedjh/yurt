"use client";

import { useParams } from "next/navigation";
import MessageItem from "@/components/chat/chat-message-item";
import { PhotoProvider } from "react-photo-view";
import "@/app/react-photo-view.css";
import { format, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";

export default function ChatMessages({
  messages,
  messageContainerRef,
  scrollAreaRef,
  isLoadingMore,
}: {
  messages?: any;
  messageContainerRef?: any;
  scrollAreaRef?: any;
  isLoadingMore?: boolean;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();

  if (!params?.serverID || !params?.spaceID) return "";

  let previousDate: Date | null = null;

  return (
    <PhotoProvider className="h-full" maskOpacity={0.9}>
      {/* <ScrollArea> */}
      <div ref={scrollAreaRef} className="p-4 h-full overflow-y-auto">
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
                  img={message.img}
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
        <div className="pb-4" ref={messageContainerRef}></div>
      </div>
      {/* </ScrollArea> */}
    </PhotoProvider>
  );
}
