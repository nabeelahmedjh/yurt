"use client";

import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowUp, PaperclipIcon } from "lucide-react";
import useCreateMessage from "@/hooks/useCreateMessage";
import { Input } from "../ui/input";

export default function ChatInput() {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autosizeTextareaRef = useRef<AutosizeTextAreaRef>(null);

  const params = useParams<{ serverID: string; spaceID: string }>();
  const { handleCreateMessage } = useCreateMessage();

  async function onSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", text);
    formData.append("attachment", fileInputRef.current?.files?.[0] as File);

    await handleCreateMessage(params.spaceID, formData);

    setText("");
    if (autosizeTextareaRef.current) {
      autosizeTextareaRef.current.textArea.style.height = `${autosizeTextareaRef.current.minHeight}px`;
    }
  }

  return (
    params.serverID &&
    params.spaceID && (
      <div className="bg-white px-1 border-2 m-4 rounded-3xl">
        <form onSubmit={onSubmit} className="flex justify-between items-center">
          <div
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-gray-200/70 rounded-full hover:opacity-90 cursor-pointer pl-[2px] pr-0 py-0 mr-[2px] focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <PaperclipIcon className="size-9 p-1 rounded-full border-0 rotate-[315deg]" />
          </div>
          <Input ref={fileInputRef} className="hidden" type="file" />
          <AutosizeTextarea
            ref={autosizeTextareaRef}
            className="bg-transparent"
            placeholder="Type your message..."
            name="chat-input"
            required
            value={text}
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
      </div>
    )
  );
}
