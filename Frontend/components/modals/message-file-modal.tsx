"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function MessageFileModal({
  openMessageFileModal,
  setOpenMessageFileModal,
}: {
  openMessageFileModal: boolean;
  setOpenMessageFileModal: (open: boolean) => void;
}) {
  return (
    <Dialog open={openMessageFileModal} onOpenChange={setOpenMessageFileModal}>
      <DialogContent className="bg-secondary h-[200px] w-[400px] flex flex-col items-center">
        <div className="mt-8 space-y-4 text-center">
          <div className="text-lg"> You can only Upload 5 files</div>
          <div className="text-lg"> Each File size should be under 5MB</div>
          <div className="text-lg">Only Image & Word files supported</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
