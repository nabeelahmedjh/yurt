import { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useParams } from "next/navigation";
import { getMessages } from "@/ApiManager/apiMethods";
import SocketService from "@/services/SocketService";
import { emitIdentity } from "@/lib/emit-identity";

const PAGE_SIZE = 10;
const fetcher = async (spaceId: string, pageIndex: number) => {
  if (isNaN(pageIndex)) pageIndex = 0;
  const searchParams = {
    limit: PAGE_SIZE,
    page: pageIndex + 1,
  };

  const data: any = await getMessages(spaceId, searchParams);
  return data?.data || [];
};

const useGetMessages = () => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const spaceId = params?.spaceID;

  const [messages, setMessages] = useState<object[]>([]);

  const getKey: any = (pageIndex: number, previousPageData: any) => {
    if (!spaceId) return null;
    if (previousPageData && !previousPageData.length) return null;
    return [spaceId, pageIndex];
  };

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    ([spaceId, pageIndex]) => fetcher(spaceId.toString(), Number(pageIndex))
  );

  useEffect(() => {
    if (data) {
      const mergedMessages = data ? [].concat(...data) : [];
      setMessages(mergedMessages.reverse());
    }
  }, [data]);

  useEffect(() => {
    mutate();
  }, [spaceId, mutate]);

  useEffect(() => {
    const socket = SocketService.connect();

    const handleMessage = (message: any) => {
      // console.log("new message", message.message);
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

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  return {
    messages,
    isLoading: isLoadingInitialData || isValidating,
    isLoadingMore,
    isReachingEnd,
    setSize,
    error,
  };
};

export default useGetMessages;
