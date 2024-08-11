"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { DialogComponent } from "@syncfusion/ej2-react-popups";

import FileManager from "@/components/file-manager";

import { useParams } from "next/navigation";
import { useState } from "react";

type role = "admin" | "member";

export default function FileManagerModal() {
  const [visibility, setDialogVisibility] = useState(false);

  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params.serverID;

  // calculate role from api endopoint

  const role: role = "admin";

  return (
    // <Dialog>
    //   <DialogTrigger className="bg-primary py-4 px-8 w-full hover:bg-primary/50 transition-colors">
    //     File Manager
    //   </DialogTrigger>
    //   <DialogContent className=" p-0 sm:rounded-none max-w-[90vw] [&>button]:hidden">
    //     <FileManager serverId={serverId} role={role} />
    //   </DialogContent>
    // </Dialog>

    <div>
      <div
        className="bg-primary py-4 px-8 w-full hover:bg-primary/50 transition-colors cursor-pointer"
        onClick={() => setDialogVisibility(!visibility)}
      >
        File Manager
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
