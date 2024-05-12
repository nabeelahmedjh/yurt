import useSWR from "swr";
import { getData } from "@/lib/get-data";

export function Messages({ params }: { params: any }) {
  const { data, error, isLoading } = useSWR(
    `/spaces/${params.spaceID}/messages`,
    getData
  );

  return (
    <>
      <div>
        <p>Messages</p>
        {data?.map((message: any) => (
          <li key={message._id}>{message.content}</li>
        ))}
      </div>
    </>
  );
}
