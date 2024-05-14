"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateSpaceModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, status } = await postSpace(values, params);

    if (status?.code === 201) {
      router.push(`/servers/${params?.serverID}/${data?.data?._id}`);
      toast.success("Space Created Successfully");
      form.reset();
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
          <DialogDescription>
            Enter required details to create a space.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              id="create-space"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Space name" {...field} />
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
                      <Input placeholder="Space description" {...field} />
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

async function postSpace(
  spaceDetails: object,
  params: { serverID: string; spaceID: string }
) {
  let response;
  let token = getCookie("authToken");
  try {
    response = await axios.post(
      `${apiUrl}/servers/${params?.serverID}/spaces`,
      spaceDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }

  return {
    data: response?.data,
    status: {
      code: response?.status,
      text: response?.statusText,
    },
  };
}
