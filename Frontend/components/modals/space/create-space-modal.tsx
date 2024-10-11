"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useCreateSpace from "@/hooks/space/useCreateSpace";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function CreateSpaceModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const { handleCreateSpace } = useCreateSpace();

  const formSchema = z.object({
    name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
    description: z
      .string()
      .min(10, "Description is too short")
      .max(100, "Description is too long"),
    type: z.enum(["CHAT", "VOICE"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "CHAT",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const error = await handleCreateSpace(params.serverID, values);

    if (!error) {
      // router.push(`/servers/${params?.serverID}/${data?.data?._id}`);

      // router refresh is required so that identity event emits again and the new
      // server is added in to the room

      router.refresh();

      toast.success("Space Created Successfully");
      form.reset();
      setIsOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
          <DialogDescription>
            Enter required details to create a space.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              id="create-space"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Space name, keep it fresh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Drop a cool description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormLabel
                            className={`border font-normal py-3 px-4 rounded-md bg-[#f3f3f3] flex items-center justify-between w-full ${
                              field.value === "CHAT" ? "bg-secondary" : ""
                            }`}
                          >
                            <span className="flex gap-1">
                              Text Chat{" "}
                              <p className="text-gray-400">
                                (messages, images, and more)
                              </p>
                            </span>
                            <FormControl>
                              <RadioGroupItem value="CHAT" />
                            </FormControl>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormLabel
                            className={`border font-normal py-3 px-4 rounded-md bg-[#f3f3f3] flex items-center justify-between w-full ${
                              field.value === "VOICE" ? "bg-secondary" : ""
                            }`}
                          >
                            <span className="flex gap-1">
                              Voice Chat{" "}
                              <p className="text-gray-400">
                                (voice, video, and more)
                              </p>
                            </span>
                            <FormControl>
                              <RadioGroupItem value="VOICE" />
                            </FormControl>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-8"></div>
              <Button type="submit">Create Space</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
