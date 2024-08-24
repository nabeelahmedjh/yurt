import useSWR from "swr";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getTags } from "@/ApiManager/apiMethods";

const fetcher = async (url: string) => {
  const data: any = await getTags();
  return data;
};

const useGetTags = () => {
  const { data, error, mutate } = useSWR(ENDPOINTS.TAGS, fetcher);

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetTags;
