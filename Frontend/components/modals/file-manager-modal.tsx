"use client";

import { DialogComponent } from "@syncfusion/ej2-react-popups";

import FileManager from "@/components/file-manager";

import { useParams } from "next/navigation";
import { useState } from "react";
import { FolderTreeIcon } from "lucide-react";

type role = "admin" | "member";

export default function FileManagerModal() {
  const [visibility, setDialogVisibility] = useState(false);

  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params.serverID;

  // calculate role from api endopoint

  const role: role = "admin";

  return (
    <div>
      <div
        className="bg-primary py-4 px-8 w-full hover:bg-primary/50 transition-colors cursor-pointer"
        onClick={() => setDialogVisibility(!visibility)}
      >
        <div className="text-black font-medium flex gap-4 justify-center">
          <span>Server Directory</span>
          <FolderTreeIcon />
        </div>
      </div>
      <DialogComponent
        cssClass="[&>div]:!p-0 !rounded-none"
        isModal={true}
        width="90%"
        visible={visibility}
        close={() => setDialogVisibility(false)}
        overlayClick={() => setDialogVisibility(false)}
      >
        <FileManager serverId={serverId} role={role} />
      </DialogComponent>
    </div>
  );
}
