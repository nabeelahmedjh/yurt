/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import useCreateMessage from "@/hooks/useCreateMessage";
import { useParams } from "next/navigation";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export default function BotInput({
  scrollToBottomRef,
}: {
  scrollToBottomRef: React.RefObject<HTMLDivElement>;
}) {
  const [messageSent, setMessageSent] = useState(false);
  const [text, setText] = useState("");
  const autosizeTextareaRef = useRef<AutosizeTextAreaRef>(null);
  const params = useParams<{ serverID: string; spaceID: string }>();
  const { handleCreateMessage, loading } = useCreateMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim().length === 0) return;

    e.preventDefault();
    const formData = new FormData();
    formData.append("content", text);

    const response = await handleCreateMessage(params.spaceID, formData);

    setText("");

    if (autosizeTextareaRef.current) {
      autosizeTextareaRef.current.textArea.style.height = `${autosizeTextareaRef.current.minHeight}px`;
    }

    setMessageSent(true);
  };

  // useEffect(() => {
  //   if (messageSent) {
  //     scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //     setMessageSent(false);
  //   }
  // }, [messageSent, scrollToBottomRef]);

  return (
    params.serverID &&
    params.spaceID && (
      <>
        <div className="bg-white px-1 border-2 m-4 mt-0 rounded-3xl">
          <form
            onSubmit={handleSubmit}
            className="flex justify-between items-center"
          >
            <AutosizeTextarea
              ref={autosizeTextareaRef}
              className="bg-transparent text-lg scrollbar-hidden"
              placeholder="Type your message..."
              name="chat-input"
              value={text}
              onKeyDown={(e) => {
                if (
                  !loading &&
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  text.trim().length > 0
                ) {
                  e.preventDefault();
                  handleSubmit(e);
                } else if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              disabled={loading}
              variant="ghost"
              className="rounded-none pl-[6px] pr-0 py-0 mr-[2px] hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ArrowUp className="size-9 p-1 rounded-full bg-secondary border-2" />
            </Button>
          </form>
        </div>
      </>
    )
  );
}
