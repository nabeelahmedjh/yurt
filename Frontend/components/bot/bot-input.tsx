/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import useCreateMessage from "@/hooks/useCreateMessage";
import { useParams } from "next/navigation";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";

import { Button } from "@/components/ui/button";
import { ArrowUp, SendHorizonalIcon } from "lucide-react";
import SocketService from "@/services/SocketService";
import { getProfile } from "@/ApiManager/apiMethods";

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

    const profile: any = await getProfile();
    const botSpaceId = profile.data.botSpace;

    const socket = SocketService.connect();
    socket.emit("BOT_MESSAGE", {
      spaceId: botSpaceId,
      content: text,
    });

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
    <>
      <div className="bg-white px-1 border-[1px] rounded-[4px] m-2 mt-0">
        <form
          onSubmit={handleSubmit}
          className="flex justify-between items-center min-h-8 max-h-20"
        >
          <AutosizeTextarea
            minHeight={24}
            maxHeight={80}
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
            className=" h-auto rounded-none pl-[6px] pr-0 py-0 mr-[2px] hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <SendHorizonalIcon
              strokeWidth={1.5}
              className="p-1 text-lime-500 size-8"
            />
          </Button>
        </form>
      </div>
    </>
  );
}
