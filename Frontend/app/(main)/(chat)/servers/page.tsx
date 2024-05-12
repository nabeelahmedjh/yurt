import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  let response;
  let token = cookieStore.get("authToken")?.value ?? "";

  try {
    response = await axios.get(`${apiUrl}/servers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }

  const serverID: string = response?.data[0]._id;

  const spaceID: string = response?.data[0].spaces[0]._id;

  const url: string = `/servers/${serverID}/${spaceID}`;

  redirect(url);
}
