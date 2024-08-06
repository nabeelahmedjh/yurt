"use client";

import { useParams } from "next/navigation";
import MessageItem from "@/components/chat/chat-message-item";
import { PhotoProvider } from "react-photo-view";
import "@/app/react-photo-view.css";

export default function ChatMessages({
  messages,
  messageContainerRef,
}: {
  messages?: any;
  messageContainerRef?: any;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();

  if (!params?.serverID || !params?.spaceID) return "";

  return (
    <PhotoProvider maskOpacity={0.9}>
      <div className="p-4">
        {params?.spaceID &&
          messages?.map((message: any) => (
            <li className="list-none" key={message._id}>
              <MessageItem
                img={message.img}
                content={message.content}
                attachment={message.attachment}
                name={
                  message?.sentBy?.username
                    ? message?.sentBy?.username
                    : message?.sentBy?.email ?? "Unknown"
                }
              />
            </li>
          ))}
        <div className="pb-4" ref={messageContainerRef}></div>
      </div>
    </PhotoProvider>
  );
}
