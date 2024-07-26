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

import useCreateServer from "@/hooks/useCreateServer";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateServerModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const params = useParams<{ serverID: string; spaceID: string }>();
  const router = useRouter();
  const { loading, handleCreateServer } = useCreateServer();

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
    // const { data, status } = await postServer(values);

    const error = await handleCreateServer(values);

    if (!error) {
      // router.push(`/servers/${data?._id}`);
      router.refresh();
      toast.success("Server Created Successfully");
      form.reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Server</DialogTitle>
          <DialogDescription>
            Enter required details to create a server.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              id="create-server"
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
                      <Input
                        className="placeholder:text-gray-400"
                        placeholder="Wizards"
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
                        placeholder="A cool place for wizards..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-8"></div>
              <Button type="submit">Create Server</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function postServer(serverDetails: object) {
  let response;
  let token = getCookie("authToken");
  try {
    response = await axios.post(`${apiUrl}/servers`, serverDetails, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
