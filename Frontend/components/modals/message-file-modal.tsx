"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function MessageFileModal({
  openMessageFileModal,
  setOpenMessageFileModal,
}: {
  openMessageFileModal: boolean;
  setOpenMessageFileModal: (open: boolean) => void;
}) {
  return (
    <Dialog open={openMessageFileModal} onOpenChange={setOpenMessageFileModal}>
      <DialogContent className="bg-red-50 pt-8 w-[95vw] md:w-[400px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-center  pt-6">
          <div className="text-lg"> You can only Upload 5 files max</div>
          <div className="text-lg"> Each File size should be under 5MB</div>
          <div className="text-lg">
            Supported File types include .jpeg, .jpg, .png, .gif, .svg, .pdf,
            .doc, .docx
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
