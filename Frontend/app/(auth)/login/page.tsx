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
import useGoogleOAuth from "@/hooks/auth/useGoogleOAuth";
import useLogin from "@/hooks/auth/useLogin";
import ForgotPasswordModal from "@/components/modals/forgot-password-modal";

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export default function Login() {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, handleLogin } = useLogin();
  const handleGoogleOAuth = useGoogleOAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await handleLogin(values);
    form.reset();
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-5xl bg-[#F2FED1] max-w-fit p-1 rounded-[8px] mb-32 font-medium">
          Sign In.
        </CardTitle>
        <CardDescription className="font-medium text-gray-950 text-base sm:text-lg mb-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline hover:no-underline bg-[#ABF600] py-1 px-2 rounded-[8px] font-normal w-fit"
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

                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-sm block py-1 hover:underline text-gray-600 w-fit"
                      >
                        Forgot Password?
                      </button>
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
          <ForgotPasswordModal
            open={showForgotPasswordModal}
            onOpenChange={setShowForgotPasswordModal}
          />
        </div>
        <div className="flex flex-col items-center space-y-2 mt-4">
          <p>or</p>
          <Button variant="link" onClick={() => handleGoogleOAuth()}>
            <p>Sign In with Google</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
