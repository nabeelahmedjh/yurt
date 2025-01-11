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
import { MailIcon, User } from "lucide-react";

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
  const isEducationVerified = profileData?.educationalDetails?.verified;

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
          <div className="flex mt-4 mb-2">
            <p
              className="font-semibold text-lg max-w-20 truncate"
              title={profileData?.username}
            >
              {profileData?.username}
            </p>
            <div
              className={`flex items-center gap-1 rounded-3xl p-1 ml-2 ${
                isEducationVerified ? "bg-lime-300" : "bg-red-300"
              }`}
            >
              <span className="bg-white p-1 rounded-full">
                <MailIcon className="size-4" />
              </span>
              <p className="px-1 text-sm">
                {isEducationVerified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
          <p className="text-gray-500"> {profileData?.email} </p>
        </div>
        <div className="mt-8">
          <div className="min-h-44 mb-8 w-full">
            <div className="w-full py-3 flex">
              <h3 className="font-medium bg-lime-200 rounded-[4px] w-fit px-1 underline text-nowrap">
                About
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
