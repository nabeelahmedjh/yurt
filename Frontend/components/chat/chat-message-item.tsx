/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL, PROXY_API_URL } from "@/constants";
import { EllipsisVerticalIcon, FileDownIcon, User } from "lucide-react";
import { PhotoView } from "react-photo-view";
import { format } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import ProfileModal from "@/components/modals/profile/profile-modal";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmAlert from "@/components/confirm-alert";
import { useState } from "react";

import SocketService from "@/services/SocketService";

export default function MessageItem({
  msgId,
  img,
  name,
  content,
  currentDate,
  attachment,
  sentBy,
}: {
  msgId: string;
  img?: string;
  name: string;
  content: string;
  currentDate: Date;
  attachment?: {
    name: string;
    size: number;
    source: string;
    type: string;
  }[];
  sentBy: any;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDeleteMessage = () => {
    const socket = SocketService.connect();
    socket.emit("DELETE_MESSAGE", { messageId: msgId });
  };

  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <ProfileModal profileData={sentBy}>
            <div className="cursor-pointer">
              <Avatar data-src={API_URL + "/" + img} className="size-10 -mb-6">
                <AvatarImage src={API_URL + "/" + img} />
                <AvatarFallback className="bg-white border">
                  <User className="size-8" />
                </AvatarFallback>
              </Avatar>
            </div>
          </ProfileModal>

          <div className="flex gap-4">
            <p className="text-[1rem] self-center font-medium">{name}</p>
            <p className="text-sm self-center text-gray-600">
              {format(currentDate, "p")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="ml-14 bg-[#B9FA77] min-w-16 max-w-max p-3 shadow-sm rounded-md rounded-tl-none">
            <p className="text-lg whitespace-pre-wrap inline-block px-2 break-all max-w-[70vw] sm:max-w-[30vw]">
              {content}
            </p>

            {attachment && (
              <div
                className={`mt-2 grid gap-2 grid-cols-1 lg:grid-cols-3 ${
                  attachment.length === 1 ? "lg:!grid-cols-1" : ""
                } ${attachment.length === 2 ? "lg:!grid-cols-2" : ""}`}
              >
                {attachment
                  ?.filter((file) => file?.type.includes("image"))
                  .map((file, index) => (
                    <div key={index} className="max-w-fit">
                      <PhotoView src={API_URL + "/" + file.source}>
                        <Image
                          height={144}
                          width={160}
                          alt=""
                          src={PROXY_API_URL + "/" + file.source}
                          className="w-36 h-full aspect-[9/10] object-cover rounded-sm"
                        />
                      </PhotoView>
                    </div>
                  ))}

                {attachment
                  ?.filter((file) => !file?.type.includes("image"))
                  .map((file, index) => (
                    <div key={index} className="max-w-fit max-h-fit">
                      <a
                        download={file.name}
                        href={PROXY_API_URL + "/" + file.source}
                        target="_blank"
                        className="text-center block bg-neutral-100 rounded-sm  aspect-[9/10]"
                      >
                        <div className="flex flex-col justify-center items-center h-full">
                          <FileDownIcon className="mx-2 mt-4 size-28" />
                          <div className="flex flex-col justify-center items-center text-center">
                            <p className="text-sm">
                              {formatFileSize(file.size)}
                            </p>
                            <p
                              title={file.name}
                              className="w-28 overflow-hidden whitespace-nowrap text-ellipsis mx-4"
                            >
                              {file.name}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowDropdown(true)}
              className="hover:bg-neutral-100 rounded-full p-1"
            >
              <EllipsisVerticalIcon />
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
                  <button>Delete</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmAlert
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              title="Delete Message"
              descripton="Are you sure you want to delete this message?"
              action={handleDeleteMessage}
              actionLabel="Delete"
              actionClassName="bg-red-500 hover:bg-red-500 hover:text-white border-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
