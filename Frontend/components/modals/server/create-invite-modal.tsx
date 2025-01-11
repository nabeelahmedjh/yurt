"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useRef, useState } from "react";
import ms from "ms";
import { useCopyToClipboard } from "usehooks-ts";

import useCreateInvite from "@/hooks/server/useCreateInvite";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function CreateInviteModal({
  children,
  inviteCodes,
}: {
  children: React.ReactNode;
  inviteCodes: string[];
}) {
  const [inviteLink, setInviteLink] = useState<string>("");

  const SelectContainerRef = useRef(null);
  const [_, copy] = useCopyToClipboard();

  const { handleCreateInvite, loading } = useCreateInvite();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
        toast.success("Invite link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast.error("Failed to copy invite link to clipboard!");
      });
  };

  const formSchema = z.object({
    expiresIn: z.enum(["1h", "1d", "7d", "30d"]),
    usageLimit: z.enum(["10", "20", "50", "100"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expiresIn: "1h",
      usageLimit: "10",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formValues = {
      expiresIn: ms(values.expiresIn),
      usageLimit: parseInt(values.usageLimit),
    };

    console.log(formValues);
    const response: any = await handleCreateInvite(formValues);

    if (response.result) {
      const inviteCode = response.result.data.code;

      console.log(inviteCode);
      setInviteLink(`${window.origin}/invite/${inviteCode}`);

      form.reset();
    }
    if (response.error) {
      console.error(response.error);
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invite</DialogTitle>
          <DialogDescription className="sr-only">
            Enter details to generate the invite link
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              ref={SelectContainerRef}
              id="create-invite"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="expiresIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires after</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="SELECT EXPIRY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent container={SelectContainerRef?.current}>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="1d">1 day</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of uses</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="SELECT USAGE COUNT" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent container={SelectContainerRef?.current}>
                          <SelectItem value="10">10 uses</SelectItem>
                          <SelectItem value="20">20 uses</SelectItem>
                          <SelectItem value="50">50 uses</SelectItem>
                          <SelectItem value="100">100 uses</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-8"></div>
              <Button disabled={loading} type="submit">
                Generate Invite
              </Button>
            </form>
          </Form>
        </div>

        <div className="min-h-[70px]">
          <div className="text-sm font-semibold mt-2">Invite Link</div>
          <div className="mt-2 space-y-2">
            {inviteLink ? (
              <div className="text-sm font-semibold">
                {inviteLink}
                <button
                  onClick={handleCopy(inviteLink)}
                  type="button"
                  className="!ml-2 bg-primary text-black px-2 py-1 rounded-md"
                >
                  Copy
                </button>
              </div>
            ) : (
              <div className="h-10 bg-secondary rounded-sm"></div>
            )}
          </div>
        </div>

        {/* <div className="px-4 bg-neutral-100 min-h-24 rounded-lg">
          <div className="text-sm font-semibold mt-2">Invite Codes</div>
          <div className="mt-2 space-y-2">
            {inviteCodes.map((code) => (
              <div key={code} className="text-sm font-semibold">
                {code}
              </div>
            ))}
          </div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
