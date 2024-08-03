import useSWR from 'swr';
import { useParams } from "next/navigation";
import { useEffect } from 'react';
import ENDPOINTS from '@/ApiManager/endpoints';
import { getServers } from '@/ApiManager/apiMethods';

const fetcher = async (url: string) => {
  const data: any = await getServers();
  return data;
};

const useGetServers = () => {
  const { data, error, mutate } = useSWR(ENDPOINTS.SERVERS, fetcher);

  const params = useParams<{ serverID: string; spaceID: string }>();
    const serverId = params?.serverID;


  useEffect(() => {
    mutate();
  }, [serverId, mutate]);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetServers;
