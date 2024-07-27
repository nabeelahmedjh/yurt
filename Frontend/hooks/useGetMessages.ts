import useSWR from 'swr';
import { useParams } from "next/navigation";
import { useEffect } from 'react';
import { getMessages } from '@/ApiManager/apiMethods';

const fetcher = async (spaceId: string) => {
  const data: any = await getMessages(spaceId);
  return data;
};

const useGetMessages = () => {

  const params = useParams<{ serverID: string; spaceID: string }>();
    const spaceId = params?.spaceID;

  const { data, error, mutate } = useSWR(spaceId ?? null, fetcher);


  useEffect(() => {
    mutate();
  }, [spaceId, mutate]);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetMessages;
