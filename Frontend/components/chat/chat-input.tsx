"use client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import axios from "axios";

import { getCookie } from "cookies-next";

import { useParams } from "next/navigation";
import { ArrowUp } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChatInput() {
  const [text, setText] = useState("");
  const params = useParams<{ serverID: string; spaceID: string }>();

  async function onSubmit(e: any) {
    e.preventDefault();
    console.log(text);
    const formData = new FormData();

    formData.append("content", text);

    await postMessage(formData, params);

    setText("");
    e.target.value = "";
  }

  return (
    <div className="bg-white px-1 border-2 m-4 rounded-3xl">
      {params.serverID && params.spaceID && (
        <form onSubmit={onSubmit} className="flex justify-between items-center">
          <AutosizeTextarea
            className="bg-transparent"
            placeholder="Type your message..."
            name="chat-input"
            required
            defaultValue={text}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && text.trim().length > 0) {
                e.preventDefault();
                onSubmit(e);
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            variant="ghost"
            className="rounded-none pl-[6px] pr-0 py-0 mr-[2px] hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <ArrowUp className="size-9 p-1 rounded-full bg-secondary border-2" />
          </Button>
        </form>
      )}
    </div>
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
