"use client";

import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must contain more than 8 characters")
    .max(50),
});
