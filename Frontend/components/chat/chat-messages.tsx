"use client";

import { useParams } from "next/navigation";
import MessageItem from "@/components/chat/chat-message-item";

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
    <div className="p-4">
      {params?.spaceID &&
        messages?.map((message: any) => (
          <li className="list-none" key={message._id}>
            <MessageItem
              img={message.img}
              content={message.content}
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
  );
}
