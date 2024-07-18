"use client";
import axios from "axios";
import { getCookie } from "cookies-next";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getData(url: string) {
  let response;
  let token = getCookie("authToken") ?? "";
  try {
    response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
