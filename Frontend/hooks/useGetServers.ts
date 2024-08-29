import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useParams } from "next/navigation";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getServers } from "@/ApiManager/apiMethods";

interface UseGetServersReturn {
  data: any;
  isLoading: boolean;
  error: any;
  mutate: () => void;
  size?: number;
  setSize?: (size: number) => any;
  isReachingEnd?: boolean;
  noMorePages?: boolean;
}

let noMorePages = false;

const fetcher = async (params: any) => {
  const data: any = await getServers(params);
  if (data.page && data.totalPages && data.page === data.totalPages) {
    noMorePages = true;
  }
  return data.data;
};

const useGetServers = (
  searchParams: any,
  paginated: boolean = false
): UseGetServersReturn => {
  const params = useParams<{ serverID: string; spaceID: string }>();
  const serverId = params?.serverID;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!paginated) return [ENDPOINTS.SERVERS, searchParams];

    if (previousPageData && !previousPageData.length) return null;

    const paginatedParams = {
      ...searchParams,
      page: pageIndex + 1,
    };

    return [ENDPOINTS.SERVERS, paginatedParams];
  };

  const swr = useSWR([ENDPOINTS.SERVERS, searchParams], ([_, searchParams]) =>
    fetcher(searchParams)
  );
  const swrInfinite = useSWRInfinite(getKey, ([_, paginatedParams]) =>
    fetcher(paginatedParams)
  );

  const data =
    paginated && swrInfinite.data
      ? swrInfinite.data.flatMap((page) => page)
      : swr.data;
  const isLoading = paginated
    ? !swrInfinite.error && !swrInfinite.data
    : !swr.error && !swr.data;
  const error = swr.error || swrInfinite.error;

  return {
    data,
    isLoading,
    error,
    mutate: paginated ? swrInfinite.mutate : swr.mutate,
    size: paginated ? swrInfinite.size : undefined,
    setSize: paginated ? swrInfinite.setSize : undefined,
    isReachingEnd:
      paginated &&
      swrInfinite.data &&
      swrInfinite.data[swrInfinite.data.length - 1]?.length === 0,
    noMorePages,
  };
};

export default useGetServers;
