"use client";

import { PROXY_API_URL } from "@/constants";
import { Button } from "../ui/button";
import Image from "next/image";
import { joinServer } from "@/ApiManager/apiMethods";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Servers({
  servers,
  isLoading,
}: {
  servers: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <ServerLoadingSkeleton />;
  }

  return (
    <div className="mx-12 mb-12 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {servers?.map((server: any) => (
        <ServerCard key={server._id} server={server} />
      ))}
    </div>
  );
}

function ServerCard({ server }: { server: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinServer = async () => {
    setIsLoading(true);
    const data: any = await joinServer(server._id);
    router.push(`/servers/${data.data._id}`);
    setIsLoading(false);
  };

  return (
    <div className="border-2 rounded-sm bg-primary flex flex-col relative pt-[400px] mb-6">
      <div className="rounded-t-sm absolute top-0 w-full">
        <Image
          className="rounded-t-[8px] w-full h-[170px] object-cover object-center"
          alt="server banner"
          width={100}
          height={100}
          quality={100}
          unoptimized
          src={
            server.banner?.source
              ? PROXY_API_URL + "/" + server.banner?.source
              : "/server_banner_placeholder.png"
          }
        />
      </div>
      <div className="absolute bottom-0 w-full border-t border-neutral-200 p-4 pt-8 bg-white rounded-b-sm rounded-t-[32px]">
        <p
          title={server.name}
          className="max-w-[80%] overflow-hidden text-ellipsis font-medium text-lg mb-1"
        >
          {server.name}
        </p>
        {/* {server.tags?.length > 0 &&
          server.tags?.map((tag: any) => (
            <span
              key={tag._id}
              className="bg-gray-200 text-slate-600 text-sm px-2 py-1 rounded-sm mr-2"
            >
              {tag.name}
            </span>
          ))} */}
        <div className="h-[150px]">
          <p className="text-slate-500 break-words mt-2">
            {server.description}
          </p>
        </div>
        <div className="flex items-center w-full justify-between mt-6">
          <div className="flex items-center">
            <span className="bg-gray-400 size-2 rounded-full mr-2"></span>
            <p className="text-slate-400 text-sm">
              {server.membersCount} Members
            </p>
          </div>
          <Button
            disabled={isLoading}
            onClick={server.userJoined ? undefined : handleJoinServer}
            variant="unstyled"
            size="unsized"
            className={`px-10 py-1.5 border-2 rounded-sm ${
              server.userJoined
                ? "bg-black text-white cursor-not-allowed"
                : "border-primary hover:bg-primary"
            }`}
          >
            {isLoading ? "Loading" : server.userJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServerLoadingSkeleton() {
  return (
    <div className="mx-12 mb-12 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="border-2 rounded-sm bg-primary relative pt-[350px] mb-6 animate-pulse"
        >
          <div className="rounded-t-sm absolute top-0 w-full">
            <div className="w-full h-[200px] bg-gray-300"></div>
          </div>
          <div className="absolute bottom-0 w-full border-t border-neutral-200 p-4 pt-8 bg-white rounded-b-sm rounded-t-[32px]">
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
            <div className="w-full h-4 bg-gray-300 mb-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
