import useSWR from "swr";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getUsers } from "@/ApiManager/apiMethods";

const fetcher = async (params: any) => {
  const data: any = await getUsers(params);
  return data;
};

const useGetUsers = (searchParams: any) => {
  const { data, error, mutate } = useSWR(
    [ENDPOINTS.SERVERS, searchParams],
    ([_, searchParams]) => fetcher(searchParams)
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetUsers;
