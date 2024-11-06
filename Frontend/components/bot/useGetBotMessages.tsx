import { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { getBotMessages, getProfile } from "@/ApiManager/apiMethods";
import SocketService from "@/services/SocketService";
import { emitIdentity } from "@/lib/emit-identity";

const PAGE_SIZE = 5;

const fetcher = async (spaceId: string, pageIndex: number) => {
  if (isNaN(pageIndex)) pageIndex = 0;
  const searchParams = {
    limit: PAGE_SIZE,
    page: pageIndex + 1,
  };

  const data: any = await getBotMessages(spaceId, searchParams);
  return data?.data || [];
};

const useGetBotMessages = () => {
  const [profile, setProfile] = useState<any>(null); // Store profile
  const [messages, setMessages] = useState<object[]>([]);

  // Fetch profile data once when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData); // Set profile after fetching
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, []);

  const spaceId = profile?.data?.botSpace; // Access spaceId from profile

  // Define SWR key only if spaceId exists
  const getKey: any = (pageIndex: number, previousPageData: any) => {
    if (!spaceId) return null;
    if (previousPageData && !previousPageData.length) return null;
    return [spaceId, pageIndex];
  };

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    ([spaceId, pageIndex]) => fetcher(spaceId.toString(), Number(pageIndex)),
    { revalidateFirstPage: false }
  );

  // Handle data and merge messages
  useEffect(() => {
    if (data) {
      const mergedMessages = data ? [].concat(...data) : [];
      setMessages(mergedMessages.reverse());
    }
  }, [data]);

  useEffect(() => {
    if (spaceId) mutate(); // Only mutate when spaceId is available
  }, [spaceId, mutate]);

  useEffect(() => {
    const socket = SocketService.connect();

    const handleMessage = (message: any) => {
      console.log("Bot Reply: ", message);

      // temporary change later
      // const tempMessage = {
      //   content: message,
      // };

      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const onConnect = () => {
      emitIdentity();
    };

    socket.on(`BOT_RESPONSE`, handleMessage);
    socket.on(`connect`, onConnect);

    return () => {
      socket.off(`connect`, onConnect);
      socket.off(`BOT_RESPONSE`, handleMessage);
      SocketService.disconnect();
    };
  }, []);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  return {
    mutate,
    messages,
    isLoading: isLoadingInitialData || isValidating,
    isLoadingMore,
    isReachingEnd,
    setSize,
    error,
  };
};

export default useGetBotMessages;
