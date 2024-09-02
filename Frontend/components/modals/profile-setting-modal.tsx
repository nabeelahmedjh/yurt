"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UploadAvatar from "@/components/image-uploader/upload-avatar";

export default function ProfileSettingModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        OverlayclassName="place-items-start"
        className="dialog-content-element "
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>View or Edit your profile</DialogDescription>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  );
}
