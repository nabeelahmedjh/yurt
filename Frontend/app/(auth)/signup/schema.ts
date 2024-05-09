"use client";

import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Username must contain more than 2 characters")
    .max(50),

  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must contain more than 8 characters")
    .max(50),
});
