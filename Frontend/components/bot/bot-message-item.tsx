/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/constants";
import { User } from "lucide-react";
import { format } from "date-fns";

export default function BotMessageItem({
  img,
  name,
  content,
  currentDate,
  sentBy,
}: {
  img?: string;
  name: string;
  content: string;
  currentDate: Date;
  sentBy: any;
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <div className="cursor-pointer">
            <Avatar data-src={API_URL + "/" + img} className="size-10 -mb-6">
              <AvatarImage src={API_URL + "/" + img} />
              <AvatarFallback className="bg-white border">
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex gap-4">
            <p className="text-[1rem] self-center font-medium">{name}</p>
            <p className="text-sm self-center text-gray-600">
              {format(currentDate, "p")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="ml-14 bg-[#B9FA77] min-w-16 max-w-max p-3 shadow-sm rounded-md rounded-tl-none">
            <p className="text-lg whitespace-pre-wrap inline-block px-2 break-all max-w-[70vw] sm:max-w-[30vw]">
              {content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
