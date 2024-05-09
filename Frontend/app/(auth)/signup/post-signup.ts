"use client";

import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postSignup(signupData: object) {
  let response;
  try {
    response = await axios.post(`${apiUrl}/auth/signup`, signupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }

  return response;
}
