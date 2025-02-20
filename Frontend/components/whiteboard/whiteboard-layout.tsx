import { Loader } from "lucide-react";
import Whiteboard from "./whiteboard";
import useGetProfile from "@/hooks/user/useGetProfile";

export default function WhiteboardLayout() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading && !profile) {
    return (
      <div className="w-full h-full bg-secondary flex justify-center items-center animate-pulse">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Whiteboard profile={profile} />
    </>
  );
}
