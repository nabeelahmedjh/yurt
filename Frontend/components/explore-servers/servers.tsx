import { PROXY_API_URL } from "@/constants";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Servers({ servers }: { servers: any }) {
  return (
    <div className="mx-12 mb-12 gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {servers?.map((server: any) => (
        <ServerCard key={server._id} server={server} />
      ))}
    </div>
  );
}

function ServerCard({ server }: { server: any }) {
  const handleJoinServer = () => {
    alert(`Demo Joining server \n ${server.name} - ${server._id}`);
  };

  return (
    <div className="border-2 rounded-sm relative pt-[150px] bg-primary">
      <div className="rounded-t-sm absolute top-0 w-full">
        <Image
          className="rounded-t-[8px] w-full h-[200px] object-cover"
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
      <div className="relative p-4 pt-8 bg-white rounded-b-sm rounded-t-[32px]">
        <p
          title={server.name}
          className="max-w-[80%] overflow-hidden text-ellipsis font-medium text-lg mb-2"
        >
          {server.name}
        </p>
        <p className="text-slate-500"> {server.description} </p>
        <div className="flex items-center w-full justify-between mt-6">
          <div className="flex items-center">
            <span className="bg-gray-400 size-2 rounded-full mr-2"></span>
            <p className="text-slate-400 text-sm">
              {server.membersCount} Members
            </p>
          </div>
          <Button
            onClick={server.userJoined ? undefined : handleJoinServer}
            variant="unstyled"
            size="unsized"
            className={`px-10 py-1.5 border-2 rounded-sm ${
              server.userJoined
                ? "bg-black text-white cursor-not-allowed"
                : "border-primary hover:bg-primary"
            }`}
          >
            {server.userJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}
