import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../api/axios";
import { Media, Pagination } from "@/types/Media";

interface GetMediaResponse {
  data: Media[];
  pagination: Pagination;
}

export const useGetMedia = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  const LIMIT = isLargeScreen ? 10 : 5; // Increased for better UX

  const checkScreenSize = useCallback(() => {
    setIsLargeScreen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    checkScreenSize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [checkScreenSize]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isError,
    isRefetching,
  } = useInfiniteQuery<GetMediaResponse>({
    queryKey: ["media", LIMIT], 
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await axiosInstance.get<GetMediaResponse>(
          "/media/get-media",
          {
            params: {
              page: pageParam,
              limit: LIMIT,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching media:", error);
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      const currentPage = Number(page);
      const totalPagesNum = Number(totalPages);

      return currentPage < totalPagesNum ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (data && data.pages.length > 0) {
      refetch();
    }
  }, [LIMIT, refetch, data]);

  const media = data?.pages.flatMap((page) => page.data) || [];

  const totalCount = data?.pages[0]?.pagination?.total || 0;

  const currentPagination = data?.pages[data.pages.length - 1]?.pagination;

  return {
    media,
    totalCount,
    currentPagination,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    isLargeScreen,
    limit: LIMIT,
  };
};
