"use client";

import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "Username must contain more than 2 characters")
    .max(50),
  password: z
    .string()
    .min(8, "Password must contain more than 8 characters")
    .max(50),
});
