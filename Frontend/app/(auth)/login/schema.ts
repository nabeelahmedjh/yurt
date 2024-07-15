"use client";

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must contain more than 8 characters")
    .max(50),
});
