import useSWR from "swr";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getServerById } from "@/ApiManager/apiMethods";
import { useParams } from "next/navigation";

const fetcher = async (serverId: string) => {
  const data: any = await getServerById(serverId);
  return data;
};

const useGetServerById = () => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params?.serverID;

  const { data, error, mutate } = useSWR(
    [ENDPOINTS.SERVER(serverId), serverId],
    ([_, serverId]) => fetcher(serverId)
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetServerById;
