"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  ArrowRight,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  Mail,
} from "lucide-react";

import { loginSchema } from "./schema";

import { postLogin } from "./post-login";

import { useRouter } from "next/navigation";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const { data, status } = await postLogin(values);
    console.log(data);
    setIsLoading(false);
    form.reset();

    if (status?.text === "OK") {
      router.refresh();

      /* Below solution does not work for some reason.
         current workaround is to have the route push in layout
         and then refresh the page in here */

      // router.push("/servers");
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-5xl bg-[#F2FED1] max-w-fit p-1 rounded-[8px] mb-32 font-medium">
          Sign In.
        </CardTitle>
        <CardDescription className="font-medium text-gray-950 text-lg mb-4 whitespace-nowrap">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline hover:no-underline ml-8 bg-[#ABF600] py-1 px-2 rounded-[8px] font-normal"
          >
            Register
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          leftIcon={<Mail strokeWidth={1.5} />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          leftIcon={<LockKeyholeIcon strokeWidth={1.5} />}
                          rightIcon={
                            showPassword ? (
                              <EyeOffIcon strokeWidth={1.5} />
                            ) : (
                              <EyeIcon strokeWidth={1.5} />
                            )
                          }
                          onRightIconClick={() =>
                            setShowPassword(!showPassword)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      <Link
                        className="text-sm block py-1 hover:underline text-gray-600"
                        href="/forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <span className="mr-2 font-medium text-sm">
                  ACCESS MY ACCOUNT
                  {<ArrowRight className="inline size-5 ml-1" />}
                </span>
                {isLoading && <LoaderCircleIcon className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex flex-col items-center space-y-2 mt-4">
          <p>or</p>
          <Button
            variant="link"
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              const width = 500;
              const height = 550;
              const left = window.innerWidth / 2 - width / 2;
              const top = window.innerHeight / 2 - height / 2;
              const options = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`;
              window.open(`${apiUrl}/auth/google`, "_blank", options);

              window.addEventListener("message", (event) => {
                if (event.origin !== apiUrl) {
                  return;
                }
                const { data } = event;
                // console.log(data.token);
                document.cookie = "authToken=" + data.token;
                router.refresh();
              });
            }}
          >
            <p>Sign In with Google</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
