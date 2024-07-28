"use client";

import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMessages from "@/hooks/useGetMessages";
import { socket } from "@/app/socket-client";

export default function ChatContent() {
  const [messages, setMessages] = useState<object[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data } = useGetMessages();

  useEffect(() => {
    console.log("Data");
    if (data) setMessages(data);
  }, [data]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Socket id: ", socket.id);
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    function onNewMessage(value: any) {
      console.log("Socket Message: ", value.message);

      setMessages((prevMessages: any) => [...prevMessages, value.message]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new message", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new message", onNewMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  };

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader />
      <ScrollArea className="flex-1 overflow-y-auto">
        <ChatMessages
          messageContainerRef={messagesEndRef}
          messages={messages}
        />
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
