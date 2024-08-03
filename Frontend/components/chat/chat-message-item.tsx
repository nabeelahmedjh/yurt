import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function MessageItem({
  img,
  name,
  content,
}: {
  img?: string;
  name: string;
  content: string;
}) {
  return (
    <>
      <div className="p-2 ml-4">
        <div className="flex gap-4">
          <div>
            <Avatar className="size-8">
              <AvatarImage src={img} />
              <AvatarFallback className="bg-green-200">
                <User className="text-green-700" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-[1rem] self-center font-medium text-green-700">
            {name}
          </p>
        </div>
        <div className="ml-12">
          <p className=" whitespace-pre-wrap bg-orange-50 text-orange-900 rounded-[8px] inline-block px-2 py-1 break-words max-w-[70vw] sm:max-w-[30vw]">
            {content}
          </p>
        </div>
      </div>
    </>
  );
}
