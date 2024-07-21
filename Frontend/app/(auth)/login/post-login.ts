"use client";

import axios from "axios";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { socket } from "@/app/socket-client";


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
      setCookie("authToken", response.data.token);
      
      // let profileData = await axios.get(`${apiUrl}/auth/profile`, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${response.data.token}`,
      //   },
      // })
      //     socket.emit("identity", profileData.data.data.user._id);
    
      //     console.log("profileData", profileData.data.data.user._id);      
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
