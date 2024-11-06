import {
  BotIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmAlert from "@/components/confirm-alert";
import useDeleteBotSpace from "./useDeleteBotMessages";

import { useState } from "react";

export default function BotChatHeader({
  isOpen,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { handleDeleteBotMessages } = useDeleteBotSpace();

  const handleDeleteMessage = () => {
    handleDeleteBotMessages();
  };

  return (
    <div>
      <div className="bg-primary py-2 flex flex-col items-start justify-center gap-2 rounded-t-2xl">
        <div className="flex w-full justify-between gap-4 px-4">
          <div className="flex self-center gap-4">
            <span className="self-center">
              <BotIcon strokeWidth={1.5} className="size-8" />
            </span>
            <p className="self-center font-medium text-sm">Ask Questions</p>
          </div>
          <div className="flex gap-1">
            <button
              disabled={!isOpen}
              onClick={() => setShowDropdown(true)}
              title={isOpen ? "Chat Settings" : ""}
              className={`${
                isOpen ? "hover:bg-white/30" : ""
              } transition p-1 rounded-full h-8`}
            >
              {isOpen && <EllipsisVerticalIcon className="self-center" />}
            </button>
            <DropdownMenu
              open={showDropdown}
              onOpenChange={setShowDropdown}
              modal={false}
            >
              <DropdownMenuTrigger>
                {
                  // Do not remove, trigger used so that dropdown knows where to portal to otherwise it wont know how to position itself
                }
                <span></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowDeleteDialog(true);
                  }}
                >
                  <button className="flex items-center gap-2 py-1">
                    {" "}
                    <TrashIcon /> Delete Conversation
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmAlert
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              title="Delete Conversation"
              descripton="Are you sure you want to delete the conversation?"
              action={handleDeleteMessage}
              actionLabel="Delete"
              actionClassName="bg-red-500 hover:bg-red-500 hover:text-white border-0"
            />
            <button
              title={`${isOpen ? "Close" : "Open"} chat`}
              className="hover:bg-white/30 transition rounded-full p-1"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <ChevronDownIcon
                className={`transition ${isOpen ? "" : "rotate-180"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
