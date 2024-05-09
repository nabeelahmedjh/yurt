"use client";

import axios from "axios";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postSignup(signupData: object) {
  let response;
  try {
    response = await axios.post(`${apiUrl}/auth/signup`, signupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    response?.statusText === "OK" && toast.success("Registered Successfully");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Something went wrong, try again.");
  }

  return {
    data: response?.data,
  };
}
