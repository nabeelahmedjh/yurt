import useSWR from "swr";
import ENDPOINTS from "@/ApiManager/endpoints";
import { getProfile } from "@/ApiManager/apiMethods";

const fetcher = async (url: string) => {
  const data: any = await getProfile();
  return data;
};

const useGetProfile = () => {
  const { data, error, mutate } = useSWR(ENDPOINTS.PROFILE, fetcher);

  // console.log("data", data?.data.educationalDetails.verified);

  return {
    isEduVerified: data?.data.educationalDetails.verified,
    data: data?.data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export default useGetProfile;
