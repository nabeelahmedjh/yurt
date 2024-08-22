import useSWR from "swr";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getServers } from "@/ApiManager/apiMethods";

const fetcher = async (url: string, params: {}) => {
  const data: any = await getServers(params);
  return data;
};

const useGetServers = (searchParams: {}) => {
  const { data, error, mutate } = useSWR(
    [ENDPOINTS.SERVERS, searchParams],
    ([url, searchParams]) => fetcher(url, searchParams)
  );

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
