"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import axios from "axios";

import { getCookie } from "cookies-next";

import { useParams } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChatInput() {
  const [text, setText] = useState("");
  const params = useParams<{ serverID: string; spaceID: string }>();

  async function onSubmit(e: any) {
    e.preventDefault();
    console.log(text);
    const formData = new FormData();
    formData.append("content", text);
    const { data, status } = await postMessage(formData, params);

    setText("");
    e.target.reset();
  }

  return (
    <div className="border-gray-200 bg-white px-4 py-2 shadow-2xl shadow-gray-600 dark:border-gray-800 dark:bg-gray-950">
      {params.serverID && params.spaceID && (
        <form onSubmit={onSubmit} className="flex justify-between">
          <Input
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus:ring-0 dark:text-gray-50"
            placeholder="Type your message..."
            type="text"
            name="chat-input"
            required
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button className="rounded-md p-2" variant="ghost">
            <SendIcon className="h-5 w-5" />
          </Button>
        </form>
      )}
    </div>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

async function postMessage(
  chatMessage: object,
  params: { serverID: string; spaceID: string }
) {
  let response;
  let token = getCookie("authToken");
  try {
    response = await axios.post(
      `${apiUrl}/spaces/${params?.spaceID}/messages`,
      chatMessage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
