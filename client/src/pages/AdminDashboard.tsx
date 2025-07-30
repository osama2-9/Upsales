import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios";
import { Media, Pagination } from "@/types/Media";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { UpdateModal } from "@/components/admin/UpdateModal";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/recoil/useUser";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface GetMediaResponse {
  data: Media[];
  pagination: Pagination;
}

export const AdminDashboard = () => {
  const { removeUserAtom } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const {
    data: mediaResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<GetMediaResponse>({
    queryKey: ["media-paginated", currentPage, limit, searchTerm, typeFilter],
    queryFn: async () => {
      const response = await axiosInstance.get<GetMediaResponse>(
        "/media/get-media",
        {
          params: {
            page: currentPage,
            limit,
            search: searchTerm || undefined,
            type: typeFilter || undefined,
          },
        }
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const media = mediaResponse?.data || [];
  const pagination = mediaResponse?.pagination;

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/media/delete-media`, {
        params: { mediaId: id },
      }),
    onSuccess: () => {
      toast.success("Media deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["media-paginated"] });
      setDeleteModalOpen(false);
      setSelectedMedia(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete media");
    },
  });

  const handleDeleteConfirm = () => {
    if (selectedMedia) {
      deleteMutation.mutate(selectedMedia.mediaId);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      removeUserAtom();
      navigate("/login");
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); 
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); 
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1); 
  };

  const PaginationControls = () => {
    if (!pagination) return null;

    const { page, totalPages, total } = pagination;
    const currentPageNum = Number(page);
    const totalPagesNum = Number(totalPages);

    const startItem = (currentPageNum - 1) * limit + 1;
    const endItem = Math.min(currentPageNum * limit, total);

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} results
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPageNum === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPageNum - 1)}
            disabled={currentPageNum === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPagesNum) }, (_, i) => {
              let pageNum;
              if (totalPagesNum <= 5) {
                pageNum = i + 1;
              } else if (currentPageNum <= 3) {
                pageNum = i + 1;
              } else if (currentPageNum >= totalPagesNum - 2) {
                pageNum = totalPagesNum - 4 + i;
              } else {
                pageNum = currentPageNum - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPageNum + 1)}
            disabled={currentPageNum === totalPagesNum}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPagesNum)}
            disabled={currentPageNum === totalPagesNum}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Media Management</h1>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full lg:w-auto">
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">All Types</option>
            <option value="Movie">Movie</option>
            <option value="TVshow">TV Show</option>
          </select>
          <Link
            className="text-white bg-black rounded-md shadow-sm px-4 py-2 font-semibold whitespace-nowrap w-full sm:w-auto text-center"
            to="/admin/add-new-media"
          >
            Add New Media
          </Link>
          <Button
            className="text-white w-full sm:w-auto"
            onClick={handleLogout}
            variant="destructive"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="space-y-2">
                    {[...Array(limit)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-red-500 py-8"
                >
                  <div className="space-y-2">
                    <p>Error loading media</p>
                    <Button
                      variant="outline"
                      onClick={() => refetch()}
                      size="sm"
                    >
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : media.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="space-y-2">
                    <p className="text-gray-500">
                      {searchTerm || typeFilter
                        ? "No media matches your search criteria."
                        : "No media items found. Add your first media item!"}
                    </p>
                    {!searchTerm && !typeFilter && (
                      <Link
                        to="/admin/add-new-media"
                        className="inline-block text-white bg-black rounded-md shadow-sm px-4 py-2 font-semibold"
                      >
                        Add First Media
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              media.map((item) => (
                <TableRow key={item.mediaId}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.type === "Movie" ? "default" : "secondary"}
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.director}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMedia(item);
                          setFormModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedMedia(item);
                          setDeleteModalOpen(true);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending &&
                        selectedMedia?.mediaId === item.mediaId
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <PaginationControls />
      {selectedMedia && (
        <>
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedMedia(null);
            }}
            onSubmit={handleDeleteConfirm}
            initialValues={selectedMedia}
            loading={deleteMutation.isPending}
          />
        </>
      )}
      {selectedMedia && (
        <>
          <UpdateModal
            isOpen={formModalOpen}
            onClose={() => {
              setFormModalOpen(false);
              setSelectedMedia(null);
            }}
            initialValues={selectedMedia}
          />
        </>
      )}
    </div>
  );
};
