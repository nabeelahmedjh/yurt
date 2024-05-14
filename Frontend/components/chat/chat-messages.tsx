/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

import axios from "axios";

import { getCookie } from "cookies-next";

import useSWR from "swr";
import { getData } from "@/lib/get-data";

import { socket } from "@/app/socket-client";

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

export default function ChatMessages({
  messages,
  setMessages,
  messageContainerRef,
}: {
  messages?: any;
  setMessages?: any;
  messageContainerRef?: any;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();

  // const { data, error, isLoading } = useSWR(
  //   `/spaces/${params?.spaceID}/messages`,
  //   getData
  // );

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    async function getData() {
      if (params?.serverID && params?.spaceID) {
        const { data, status } = await getMessages(params);
        setMessages(data);
      }
    }

    getData();
  }, [params]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onNewMessage(value: any) {
      console.log(value.message);
      setMessages((prevMessages: any) => [...prevMessages, value.message]);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new message", onNewMessage);
    // console.log(isConnected ? "connected" : "disconnected");
    // console.log(transport);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new message", onNewMessage);
    };
  }, []);

  if (!params?.serverID || !params?.spaceID) {
    return "";
  }

  return (
    <div className="p-4">
      {messages?.map((message: any) => (
        <li className="list-none" key={message._id}>
          <MessageItem
            img={message.img}
            content={message.content}
            name={message?.sentBy?.username ?? "Unknown"}
          />
        </li>
      ))}
      <div className="pb-4" ref={messageContainerRef}></div>
    </div>
  );
}

function MessageItem({
  img,
  name,
  content,
}: {
  img?: string;
  name: string;
  content: string;
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <div>
            <Avatar className="size-8">
              <AvatarImage src={img} />
              <AvatarFallback className="bg-green-200">
                <User className="text-green-700" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-[1rem] self-center font-medium text-green-700">
            {name}
          </p>
        </div>
        <div className="ml-12">
          <p className="bg-orange-50 text-orange-900 rounded-[8px] inline-block px-2 py-1 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>
        </div>
      </div>
    </>
  );
}

async function getMessages(params: { serverID: string; spaceID: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  let response;
  let token = getCookie("authToken");

  try {
    response = await axios.get(`${apiUrl}/spaces/${params?.spaceID}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }

  return {
    data: response?.data,
    status: {
      code: response?.status,
      text: response?.statusText,
    },
  };
}
