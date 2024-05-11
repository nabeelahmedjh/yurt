"use client";

import axios from "axios";
import { setCookie } from "cookies-next";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postLogin(loginData: object) {
  let response;
  try {
    response = await axios.post(`${apiUrl}/auth/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // response?.statusText === "OK" && toast.success("Login Successfully");

    if (response?.statusText === "OK") {
      setCookie("authToken", response?.data?.token);
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Something went wrong, try again.");
  }

  return {
    data: response?.data,
    status: {
      code: response?.status,
      text: response?.statusText,
    },
  };
}
