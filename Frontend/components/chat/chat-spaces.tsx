"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { FolderTreeIcon, PencilLineIcon, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CreateSpaceModal from "@/components/modals/space/create-space-modal";
import useGetServers from "@/hooks/server/useGetServers";
import FileManagerModal from "../filemanager/file-manager-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PROXY_API_URL, USER_ID } from "@/constants";

import SpaceFallbackImage from "@/public/space.png";
import ServerSettingModal from "../modals/server/server-setting-modal";

import useGetServerById from "@/hooks/server/useGetServerById";

import { getCookie } from "cookies-next";
import { useState } from "react";

export default function ChatSpaces() {
  const [isServerSettingModalOpen, setIsServerSettingModalOpen] =
    useState(false);

  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);

  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const searchParam = {
    type: "joined",
  };

  const { data } = useGetServers(searchParam);
  const { data: selectedServerData } = useGetServerById();
  const userId = getCookie(USER_ID);
  const isAdmin = selectedServerData?.[0].admins.includes(userId);

  const serverImage = selectedServerData?.[0].serverImage?.source;

  return (
    <div
      className={`${
        params.serverID && data?.length > 0 && "bg-primary"
      } h-dvh p-0 w-full flex flex-col ${
        isAdmin ? "has-[.server-settings:hover]:bg-primary/50" : ""
      }`}
    >
      <ServerSettingModal
        setIsOpen={setIsServerSettingModalOpen}
        isOpen={isServerSettingModalOpen}
      />
      <div
        onClick={() => isAdmin && setIsServerSettingModalOpen(true)}
        className={`server-settings flex flex-col relative py-4 items-center justify-center px-1  transition-[background-color] ${
          isAdmin ? "[&_.pencil-icon]:hover:inline hover:cursor-pointer" : ""
        }`}
      >
        {params.serverID && data?.length > 0 && (
          <div className="flex gap-4 items-center justify-center">
            <span className="pencil-icon absolute hidden right-2 top-2">
              <PencilLineIcon className="size-4" />
            </span>
            <div>
              <Image
                width={32}
                height={32}
                className="rounded-full size-8 object-cover"
                alt="server image"
                src={
                  serverImage
                    ? PROXY_API_URL + "/" + serverImage
                    : "/server.png"
                }
              />
            </div>
            <p
              title={
                data?.filter((server: any) => params.serverID === server._id)[0]
                  ?.name
              }
              className="font-semibold max-w-32 whitespace-nowrap text-ellipsis overflow-x-hidden"
            >
              {
                data?.filter((server: any) => params.serverID === server._id)[0]
                  ?.name
              }
            </p>
          </div>
        )}
      </div>
      {params.serverID && data?.length > 0 && (
        <div className="rounded-t-lg justify-between h-full overflow-y-auto flex flex-col bg-white">
          <div className="flex flex-col overflow-y-auto pl-2 pr-[2px]">
            <div className="flex justify-between items-center my-2 min-h-10 ml-6 mr-4">
              <p className="text-[12px] text-black font-medium bg-primary/60 rounded-[4px] h-fit">
                Spaces.
              </p>
              <CreateSpaceModal
                isOpen={isCreateSpaceModalOpen}
                setIsOpen={setIsCreateSpaceModalOpen}
              />
              <span>
                {isAdmin && (
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => setIsCreateSpaceModalOpen(true)}
                      >
                        <div className="p-3">
                          <div className="rounded-[2px] bg-black text-white size-4 flex justify-center items-center">
                            <Plus />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <p>Create Space</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
            </div>
            <Separator className="bg-slate-300" />

            <div className="mt-2 flex flex-col overflow-y-auto">
              {data
                ?.filter((server: any) => server._id === params.serverID)
                .map((server: any) => (
                  <div
                    key={server._id}
                    className="flex flex-col overflow-y-auto"
                  >
                    <ScrollArea className="space-y-1 flex flex-col">
                      {server.spaces
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                        .map((space: any) => (
                          <div
                            onClick={() =>
                              router.replace(
                                `/servers/${params.serverID}/${space._id}`
                              )
                            }
                            key={space._id}
                            className={`${
                              params.spaceID === space._id
                                ? "bg-neutral-200"
                                : "hover:bg-neutral-100"
                            } p-2 pr-3 my-1 mr-3 ml-[6px] rounded-[8px] flex justify-center gap-2 cursor-pointer flex-grow`}
                          >
                            <span>
                              <Avatar className="size-6">
                                <AvatarImage
                                  src={
                                    PROXY_API_URL +
                                    "/" +
                                    space.spaceImage?.source
                                  }
                                />

                                <AvatarFallback className="bg-transparent">
                                  <Image
                                    alt="space image"
                                    src={SpaceFallbackImage}
                                  />
                                </AvatarFallback>
                              </Avatar>
                            </span>
                            <span
                              title={space.name}
                              className="w-2 flex-grow font-medium text-black overflow-x-hidden text-ellipsis whitespace-nowrap"
                            >
                              {space.name}
                            </span>
                          </div>
                        ))}
                      <ScrollBar />
                    </ScrollArea>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <div
              className="bg-primary py-4 px-8 w-full hover:bg-primary/50 transition-colors cursor-pointer"
              onClick={() =>
                router.push(`/servers/${params.serverID}/filemanager`)
              }
            >
              <div className="text-black font-medium flex gap-4 justify-center">
                <span>Server Directory</span>
                <FolderTreeIcon />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
