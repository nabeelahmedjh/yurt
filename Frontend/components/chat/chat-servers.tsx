"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { CircleUserRoundIcon, CompassIcon, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CreateServerModal from "@/components/modals/server/create-server-modal";
import LogoutButton from "@/components/logout-button";
import useGetServers from "@/hooks/useGetServers";
import yurt_logo from "@/public/yurt_logo.svg";
import Image from "next/image";
import { PROXY_API_URL } from "@/constants";
import ProfileSettingModal from "@/components/modals/profile/profile-setting-modal";

export default function ChatServers() {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const searchParam = {
    type: "joined",
  };

  const { data, isLoading } = useGetServers(searchParam);

  return (
    <div className="bg-zinc-100 h-dvh w-min py-3 px-4 flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col overflow-y-auto">
        <div className="">
          <div className="p-1 flex justify-center">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    className="object-cover max-w-10"
                    alt="yurt logo"
                    src={yurt_logo}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className="rounded-[24px]"
                  side="right"
                  sideOffset={10}
                >
                  <span className="flex items-center">
                    <p className="self-end ms-1">Direct Messages</p>
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="w-full h-[2px] rounded-full mt-2 mb-4 bg-black " />
        </div>
        <div className="flex flex-col overflow-y-auto justify-between w-full">
          <div className="scrollbar-hidden overflow-y-auto mb-2">
            {data?.length > 0 &&
              data?.map((server: any) => (
                <div className="p-1" key={server._id}>
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <TooltipTrigger
                        className="pb-2"
                        onClick={() => {
                          router.push(`/servers/${server._id}`);
                        }}
                      >
                        <Avatar
                          className={` flex items-center justify-center size-12 bg-primary rounded-lg border-b-0 shadow-gray-400 hover:border-b-2 transition-[border] shadow-sm ${
                            params.serverID === server._id &&
                            "shadow-none border-b-4 scale-110"
                          }`}
                        >
                          <AvatarImage
                            className="h-[90%] w-[90%] rounded-xl object-cover"
                            src={
                              PROXY_API_URL + "/" + server?.serverImage?.source
                            }
                          />
                          <AvatarFallback className="bg-inherit font-medium">
                            {server.name
                              .split(" ")
                              .slice(0, 2)
                              .map((word: any) => word.charAt(0))
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <p>{server.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
          </div>
          <div>
            <div>
              <div className="flex justify-center mt-2">
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <CreateServerModal>
                      <TooltipTrigger>
                        <div className="hover:bg-neutral-200 p-2 rounded-[8px]">
                          <Plus />
                        </div>
                      </TooltipTrigger>
                    </CreateServerModal>
                    <TooltipContent side="right" sideOffset={10}>
                      <p>Create Server</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex justify-center mt-1">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger onClick={() => router.push("/explore")}>
                    <div className="hover:bg-neutral-200 p-2 rounded-[8px]">
                      <CompassIcon
                        fill="white"
                        strokeWidth={1}
                        className="size-6"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>Explore Servers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {!isLoading && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <ProfileSettingModal>
                    <TooltipTrigger>
                      <div className="hover:bg-neutral-200 p-2 rounded-[8px]">
                        <CircleUserRoundIcon
                          strokeWidth={1}
                          className="size-6"
                        />
                      </div>
                    </TooltipTrigger>
                  </ProfileSettingModal>
                  <TooltipContent side="right" sideOffset={10}>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
