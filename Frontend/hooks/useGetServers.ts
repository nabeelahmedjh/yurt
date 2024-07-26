import useSWR from 'swr';
import ENDPOINTS from '@/ApiManager/endpoints';
import { getServers } from '@/ApiManager/apiMethods';

const fetcher = async (url: string) => {
  const data: any = await getServers();
  return data;
};

const useGetServers = () => {
  const { data, error, mutate } = useSWR(ENDPOINTS.SERVERS, fetcher);

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetServers;
