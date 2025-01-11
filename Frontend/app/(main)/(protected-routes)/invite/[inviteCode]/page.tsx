"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { joinServerByInviteCode } from "@/ApiManager/apiMethods";
import { useState } from "react";

export default function InvitePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { inviteCode } = useParams();
  const router = useRouter();

  const handleInvite = async () => {
    try {
      setLoading(true);
      const response: any = await joinServerByInviteCode(inviteCode as string);
      if (response) {
        router.replace("/servers/" + response.server._id);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-dvh items-center justify-center bg-lime-100">
      <div className="min-h-[70%] bg-primary border border-b-8 shadow-md py-4 px-16 rounded-lg">
        <div className="flex flex-col justify-between py-[10%] h-full">
          <div className="space-y-4">
            <p className="font-medium text-xl">
              You have been invited to join the server
            </p>
            <p>
              {error && (
                <span className="text-red-500 text-md font-medium">
                  {error}
                </span>
              )}
            </p>
          </div>

          <Button disabled={loading} onClick={handleInvite}>
            {loading ? "Joining server..." : "Join Server"}
          </Button>
        </div>
      </div>
    </div>
  );
}
