"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Plus, TentIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CreateSpaceModal from "@/components/modals/create-space-modal";
import useGetServers from "@/hooks/useGetServers";
import FileManagerModal from "../modals/file-manager-modal";

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
    <div className="bg-white h-dvh p-0 w-full flex flex-col">
      <div className="flex flex-col items-center px-1">
        <Separator className="w-[95%] my-2 bg-gray-300" />
        {params.serverID && data?.length > 0 && (
          <div className="w-full flex items-center justify-between">
            <TooltipProvider delayDuration={700}>
              <Tooltip>
                <TooltipTrigger>
                  <p className="font-medium hover:bg-gray-200 px-1 py-[2px] rounded-[8px]">
                    {data?.filter(
                      (server: any) => params.serverID === server._id
                    )[0]?.name.length > 20
                      ? `${data
                          ?.filter(
                            (server: any) => params.serverID === server._id
                          )[0]
                          .name.slice(0, 20)}...`
                      : data?.filter(
                          (server: any) => params.serverID === server._id
                        )[0]?.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p>
                    {
                      data?.filter(
                        (server: any) => params.serverID === server._id
                      )[0]?.name
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CreateSpaceModal>
              <div className="flex justify-center mt-2">
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="hover:bg-gray-300 p-2 rounded-[8px]">
                        <Plus />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      <p>Create Space</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CreateSpaceModal>
          </div>
        )}
      </div>
      {params.serverID &&
        data?.filter((server: any) => server._id === params.serverID)[0]?.spaces
          ?.length > 0 && (
          <div className="h-full justify-between flex flex-col">
            <div className="p-1">
              <div className="flex mt-4">
                <ChevronDown className="size-4 self-center me-1" />
                <p className="text-[14px] text-gray-500">Spaces</p>
              </div>
              <div className="mt-2">
                <div>
                  {data
                    ?.filter((server: any) => server._id === params.serverID)
                    .map((server: any) => (
                      <div key={server._id} className="space-y-4">
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
                                ? "bg-[#E6E8EB]"
                                : "hover:bg-[#E6E8EB]"
                            } p-2 rounded-[8px] flex gap-2 cursor-pointer`}
                          >
                            <span>
                              <TentIcon />
                            </span>
                            <span className="font-normal text-gray-700">
                              {space.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
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
