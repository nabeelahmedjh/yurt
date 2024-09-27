"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { API_URL } from "@/constants";
import { User } from "lucide-react";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default function ProfileModal({
  profileData,
  children,
}: {
  profileData: any;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        OverlayclassName="place-items-start"
        className="min-w-[50vw] px-[clamp(8px,10vw,64px)]"
      >
        <DialogHeader className="sr-only">
          <div>
            <DialogTitle className="bg-lime-100 w-fit px-2 py-1 rounded-[8px] font-medium text-2xl">
              Profile
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            View your profile information
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center mt-16">
          <div className="my-4">
            <Avatar className="size-24 border border-b-8 rounded-[40px]">
              <AvatarImage src={API_URL + "/" + profileData.avatar?.source} />
              <AvatarFallback className="bg-orange-400 rounded-none">
                <User className="size-16" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="font-semibold text-lg"> {profileData?.username} </p>
          <p className="text-gray-500"> {profileData?.email} </p>
        </div>
        <div className="mt-8">
          <div className="min-h-44 mb-8 w-full">
            <div className="w-full py-3 flex">
              <h3 className="font-medium bg-lime-200 rounded-[4px] w-fit px-1 underline text-nowrap">
                About Me
              </h3>
              <div className="w-full mt-[1.2rem]">
                <Separator className="bg-gray-300" />
              </div>
            </div>
            <p className="break-words break-all whitespace-normal">
              {profileData?.bio}
            </p>
          </div>
          <div className="mb-8">
            <div className="w-full py-3 flex">
              <h3 className="font-medium bg-lime-200 rounded-[4px] w-fit px-1 underline">
                Interests
              </h3>
              <div className="w-full mt-[1.2rem]">
                <Separator className="bg-gray-300" />
              </div>
            </div>
            <div className="py-2 mb-2 flex flex-wrap gap-2">
              {profileData?.interests.map((interest: any) => (
                <span
                  key={interest._id}
                  className=" border-gray-400 border-2 text-gray-500 rounded-full px-6 py-1"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
