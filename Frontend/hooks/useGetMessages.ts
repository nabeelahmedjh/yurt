import { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { getMessages } from "@/ApiManager/apiMethods";
import SocketService from "@/services/SocketService";
import { emitIdentity } from "@/lib/emit-identity";

const fetcher = async (spaceId: string) => {
  const data: any = await getMessages(spaceId);
  return data;
};

const useGetMessages = () => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const spaceId = params?.spaceID;

  const [messages, setMessages] = useState<object[]>([]);

  const { data, error, mutate } = useSWR(spaceId ?? null, fetcher, {
    onSuccess: (data) => {
      setMessages(data?.data || []);
    },
  });

  useEffect(() => {
    mutate();
  }, [spaceId, mutate]);

  useEffect(() => {
    const socket = SocketService.connect();

    const handleMessage = (message: any) => {
      // console.log('new message', message.message)
      setMessages((prevMessages) => [...prevMessages, message.message]);
    };

    const onConnect = () => {
      emitIdentity();
    };

    socket.on(`new message`, handleMessage);
    socket.on(`connect`, onConnect);

    return () => {
      socket.off(`connect`, onConnect);
      socket.off(`new message`, handleMessage);
      SocketService.disconnect();
    };
  }, []);

  return {
    messages,
    isLoading: !error && !data,
    error,
  };
};

export default useGetMessages;
