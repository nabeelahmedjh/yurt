"use client";

import { useParams } from "next/navigation";
import useGetServers from "@/hooks/server/useGetServers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

import { PROXY_API_URL } from "@/constants";
import SpaceFallbackImage from "@/public/space.png";

export default function ChatHeader() {
  const params = useParams<{ serverID: string; spaceID: string }>();

  const searchParam = {
    type: "joined",
  };

  const { data, isLoading } = useGetServers(searchParam);

  const space = data
    ?.filter((server: any) => server._id === params.serverID)?.[0]
    ?.spaces?.filter((space: any) => space._id === params.spaceID)?.[0];

  if (isLoading) return;

  return (
    <div>
      <div className="bg-zinc-100 py-4 flex flex-col items-start justify-center pl-4 gap-2 border-b">
        {params.serverID && params.spaceID && (
          <div className="flex w-full gap-6 ml-[5%]">
            <span className="self-center">
              <Avatar className="size-8">
                <AvatarImage src={PROXY_API_URL + "/" + space?.spaceBanner} />

                <AvatarFallback className="bg-transparent">
                  <Image alt="space image" src={SpaceFallbackImage} />
                </AvatarFallback>
              </Avatar>
            </span>
            <div className="flex flex-col justify-center w-full">
              <p
                title={space?.name}
                className="font-medium text-xl text-black overflow-hidden text-ellipsis whitespace-nowrap w-[60%]"
              >
                {space?.name}
              </p>
              {/* <p className="text-gray-600 font-light">
                {
                  space?.description
                }
              </p> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
