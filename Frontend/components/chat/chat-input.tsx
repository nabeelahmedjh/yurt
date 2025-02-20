/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import useCreateMessage from "@/hooks/useCreateMessage";
import { useParams } from "next/navigation";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";

import { Button } from "@/components/ui/button";
import MessageFileModal from "@/components/modals/message-file-modal";
import { ArrowUp, File, PaperclipIcon, Smile, X } from "lucide-react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

import { useMediaQuery } from "usehooks-ts";

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export default function ChatInput({
  scrollToBottomRef,
}: {
  scrollToBottomRef: React.RefObject<HTMLDivElement>;
}) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [openMessageFileModal, setOpenMessageFileModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [text, setText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autosizeTextareaRef = useRef<AutosizeTextAreaRef>(null);
  const params = useParams<{ serverID: string; spaceID: string }>();
  const { handleCreateMessage, loading } = useCreateMessage();

  const desktop = useMediaQuery("(min-width: 1024px)");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILES_UPLOAD_LIMIT = 5;
    const MAX_FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Validate number of files
      if (attachedFiles.length + newFiles.length > MAX_FILES_UPLOAD_LIMIT) {
        setOpenMessageFileModal(true);
        return;
      }

      // Validate file size
      const hasLargeFile = newFiles.some(
        (file) => file.size > MAX_FILE_SIZE_LIMIT
      );
      if (hasLargeFile) {
        setOpenMessageFileModal(true);
        return;
      }

      // Validate file types manually
      const hasInvalidType = newFiles.some(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type)
      );
      if (hasInvalidType) {
        setOpenMessageFileModal(true);
        return;
      }

      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName?: string) => {
    !fileName && setAttachedFiles([]);

    setAttachedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim().length === 0 && attachedFiles.length === 0) return;

    e.preventDefault();
    const formData = new FormData();
    formData.append("content", text);
    attachedFiles.forEach((file) => {
      formData.append("attachment", file);
    });

    const response = await handleCreateMessage(params.spaceID, formData);

    setText("");
    setAttachedFiles([]);
    fileInputRef.current?.value && (fileInputRef.current.value = "");

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

  useEffect(() => {
    if (attachedFiles.length > 0) {
      console.log("attached files changed");
      scrollToBottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [attachedFiles, scrollToBottomRef]);

  useEffect(() => {
    desktop && autosizeTextareaRef.current?.textArea.focus();
  }, [desktop]);

  return (
    params.serverID &&
    params.spaceID && (
      <>
        <MessageFileModal
          openMessageFileModal={openMessageFileModal}
          setOpenMessageFileModal={setOpenMessageFileModal}
        />
        <FilePreview
          fileInputRef={fileInputRef}
          attachedFiles={attachedFiles}
          onRemoveFile={handleRemoveFile}
        />
        <div className="bg-white px-1 border-2 mx-4 my-3 mt-0 rounded-3xl">
          <form
            onSubmit={handleSubmit}
            className="flex justify-between items-center"
          >
            <div className=" absolute bottom-[12%]">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setText((prev) => prev + emojiData.emoji);
                  setIsEmojiPickerOpen(false);
                  autosizeTextareaRef.current?.textArea.focus();
                }}
                emojiStyle={EmojiStyle.NATIVE}
                open={isEmojiPickerOpen}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
            >
              {isEmojiPickerOpen ? (
                <X className="size-9 p-1 rounded-full border-0 hover:bg-gray-200/70" />
              ) : (
                <Smile className="size-9 p-1 rounded-full border-0 hover:bg-gray-200/70" />
              )}
            </button>

            <button
              type="button"
              aria-label="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-gray-200/70 rounded-full hover:opacity-90 cursor-pointer pl-[2px] pr-0 py-0 mr-[2px] focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <PaperclipIcon className="size-9 p-1 rounded-full border-0 rotate-[315deg]" />
            </button>
            <input
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept=".jpeg, .jpg, .png, .gif, .svg, .pdf, .doc, .docx"
            />
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
                  setIsEmojiPickerOpen(false);
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

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function FilePreview({
  attachedFiles,
  onRemoveFile,
  fileInputRef,
  className,
}: {
  attachedFiles: File[];
  onRemoveFile: (fileName?: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}) {
  const desktop = useMediaQuery("(min-width: 1024px)");

  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    attachedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews((prev) => ({
            ...prev,
            [file.name]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, [attachedFiles]);

  if (!attachedFiles.length) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 bg-slate-100 rounded-3xl pt-4 mx-4 my-1",
        className
      )}
    >
      <div
        title="Remove all files"
        onClick={() => {
          onRemoveFile();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        className="self-end mr-4 p-1 cursor-pointer bg-secondary border rounded-[8px] hover:bg-secondary/30 hover:scale-105 transition-transform"
      >
        <X className="size-4" />
      </div>
      <div className="bg-white rounded-3xl px-3 mx-4 my-1">
        <ScrollArea className="overflow-auto max-h-[230px]">
          <ul className="flex flex-col items-center lg:flex-row">
            {attachedFiles.map((file) => (
              <li
                key={file.name}
                className="file-item w-52 lg:w-40 mx-1 my-2 lg:my-4 flex flex-col bg-secondary rounded-lg border shadow-md p-2"
                data-filename={file.name}
              >
                <span
                  title="Remove file"
                  className="self-end p-1 mb-1 hover:bg-slate-500/10 rounded-full cursor-pointer"
                  onClick={() => {
                    onRemoveFile(file.name);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X />
                </span>
                {filePreviews[file.name] ? (
                  <img
                    src={filePreviews[file.name]}
                    alt={file.name}
                    className="h-24 object-cover rounded-sm"
                  />
                ) : (
                  <div className="flex justify-center">
                    <File strokeWidth={1} className="size-24 px-1" />
                  </div>
                )}
                <div
                  title={file.name}
                  className="px-1 mt-4 text-sm overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {file.name}
                </div>
              </li>
            ))}
          </ul>
          <ScrollBar orientation={desktop ? "horizontal" : "vertical"} />
        </ScrollArea>
      </div>
    </div>
  );
}
