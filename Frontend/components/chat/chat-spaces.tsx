"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, PencilLineIcon, Plus, TentIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CreateSpaceModal from "@/components/modals/create-space-modal";
import useGetServers from "@/hooks/useGetServers";
import FileManagerModal from "../modals/file-manager-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PROXY_API_URL } from "@/constants";

import SpaceFallbackImage from "@/public/space.png";
import ServerFallbackImage from "@/public/server.png";
import { useEffect } from "react";

export default function ChatSpaces({
  isWhiteboardOpen,
}: {
  isWhiteboardOpen: any;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const { data } = useGetServers();

  if (isWhiteboardOpen) return null;

  return (
    <div
      className={`${
        params.serverID && data?.length > 0 && "bg-primary"
      } h-dvh p-0 w-full flex flex-col has-[.server-settings:hover]:bg-primary/50`}
    >
      <div
        onClick={() => window.alert("server setting")}
        className="server-settings flex flex-col relative py-4 items-center justify-center px-1 [&_.pencil-icon]:hover:inline hover:cursor-pointer transition-[background-color]"
      >
        {params.serverID && data?.length > 0 && (
          <div className="flex gap-4 items-center justify-center">
            <span className="pencil-icon absolute hidden right-2 top-2">
              <PencilLineIcon className="size-4" />
            </span>
            <div>
              <Avatar className="size-8">
                <AvatarImage
                  className="m-1 rounded-full"
                  src={
                    PROXY_API_URL +
                    "/" +
                    data?.filter(
                      (server: any) => params.serverID === server._id
                    )[0]?.banner
                  }
                />

                <AvatarFallback className="bg-white">
                  <Image
                    className="m-1 rounded-full"
                    alt="server image"
                    src={ServerFallbackImage}
                  />
                </AvatarFallback>
              </Avatar>
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
            <div className="flex justify-between items-center my-2 ml-6 mr-4">
              <p className="text-[12px] text-black font-medium bg-primary/60 rounded-[4px] h-fit">
                Spaces.
              </p>
              <CreateSpaceModal>
                <span>
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <TooltipTrigger>
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
                </span>
              </CreateSpaceModal>
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
                      {server.spaces.map((space: any) => (
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
                                src={PROXY_API_URL + "/" + space.spaceBanner}
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
            <FileManagerModal />
          </div>
        </div>
      )}
    </div>
  );
}
