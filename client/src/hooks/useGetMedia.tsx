import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { Media, Pagination } from "@/types/Media";

interface GetMediaResponse {
  data: Media[];
  pagination: Pagination;
}

export const useGetMedia = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const LIMIT = isLargeScreen ? 5 : 1; 

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); 
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<GetMediaResponse>({
    queryKey: ["media", isLargeScreen], 
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get<GetMediaResponse>(
        "/media/get-media",
        {
          params: {
            page: pageParam,
            limit: LIMIT
          }
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return Number(page) < totalPages ? Number(page) + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    refetch();
  }, [isLargeScreen, refetch]);

  const media = data?.pages.flatMap((page) => page.data) || [];

  return {
    media,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLargeScreen, // Expose screen size info if needed by component
  };
};