"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MailIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useUpdateProfile from "@/hooks/user/useUpdateProfile";

export default function EducationVerifyModal({
  children,
  isEducationVerified,
}: {
  children: React.ReactNode;
  isEducationVerified: boolean;
}) {
  const [educationEmail, setEducationEmail] = useState("");
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { handleUpdateProfile, loading } = useUpdateProfile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!educationEmail.includes(".edu")) {
      setErrorMessage("Please enter a valid educational email address.");
      return;
    }

    const error: any = await handleUpdateProfile({
      educationalEmail: educationEmail,
    });

    if (!error) {
      setIsVerifyEmailSent(true);
      setEducationEmail("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-8 w-[95vw] md:w-[400px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center space-y-4 text-center py-8">
          {isEducationVerified ? (
            <>
              <span className="bg-lime-300 p-2 rounded-full w-fit">
                <MailIcon className="size-10" />
              </span>
              <div className="text-xl xl:text-3xl font-medium bg-secondary px-1">
                Education successfully verified
              </div>
            </>
          ) : (
            <>
              <p className="text-xl bg-secondary p-1 rounded-sm font-medium">
                Verify Education
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 md:w-96"
              >
                <Input
                  required
                  value={educationEmail}
                  onChange={(e) => setEducationEmail(e.target.value)}
                  leftIcon={<MailIcon className="size-6" />}
                  type="email"
                  placeholder="Enter your educational email"
                  className="w-full"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                {isVerifyEmailSent && (
                  <p className="bg-secondary text-sm">
                    Verify Link has been sent to your email. Please check your
                    inbox or spam folder.
                  </p>
                )}
                <Button disabled={loading} type="submit" className="w-full">
                  Send Verification Link
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
