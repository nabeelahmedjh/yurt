import useGetServerById from "@/hooks/server/useGetServerById";
import FileManager from "./file-manager";
import { getCookie } from "cookies-next";
import { USER_ID } from "@/constants";

export default function FileManagerContainer() {
  const { data: selectedServerData, isLoading } = useGetServerById();
  const userId = getCookie(USER_ID);
  const isAdmin = selectedServerData?.[0].admins.includes(userId);
  const serverId = selectedServerData?.[0]._id;

  return (
    <div className="flex items-center h-dvh">
      {selectedServerData && !isLoading && (
        <FileManager serverId={serverId} role={isAdmin ? "admin" : "member"} />
      )}
    </div>
  );
}
