"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MailIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { forgotPassword } from "@/ApiManager/apiMethods";
import Image from "next/image";
import { toast } from "sonner";

export default function ForgotPasswordModal({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await forgotPassword({
        email,
      });
      setIsEmailSent(true);
      setEmail("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-8 w-[95vw] md:w-[400px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center space-y-4 text-center py-8">
          <div className="flex flex-col items-center">
            <Image
              src="/forgot-password.svg"
              width={300}
              height={300}
              alt="forgot-password"
            />
            <h3 className="font-medium sm:text-3xl">Forget your password ?</h3>
            <p>Enter your email and we will help you reset your password</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:w-96">
            <Input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<MailIcon className="size-6" />}
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />

            {isEmailSent && (
              <p className="bg-secondary text-sm">
                Password reset Link has been sent to your email. Please check
                your inbox or spam folder.
              </p>
            )}
            <Button disabled={isLoading} type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
