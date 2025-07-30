import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios";
import { Media } from "@/types/Media";
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
import { useGetMedia } from "@/hooks/useGetMedia";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { UpdateModal } from "@/components/admin/UpdateModal";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const loaderRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState(""); // Movie / TVshow / empty
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

    const {
        media,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetMedia();

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            axiosInstance.delete(`/media/delete-media`, {
                params: {
                    mediaId: id,
                },
            }),
        onSuccess: () => {
            toast.success("Media deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-media"] });
            setDeleteModalOpen(false);
        },
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleDeleteConfirm = () => {
        if (selectedMedia) {
            deleteMutation.mutate(selectedMedia.mediaId);
        }
    };

    // Simple search + filter
    const filteredMedia = media.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter ? item.type === typeFilter : true;
        return matchesSearch && matchesType;
    });
    const handleLogout = () => {
        axiosInstance.post("/auth/logout");
        navigate("/login");
        queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Media Management</h1>
                <Button className="text-blue-500 hover:text-blue-700" onClick={handleLogout}>Logout</Button>
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">All Types</option>
                        <option value="Movie">Movie</option>
                        <option value="TVshow">TV Show</option>
                    </select>
                    <Link
                        className="text-white bg-black rounded-md shadow-sm px-4 py-2 font-semibold"
                        to="/admin/add-new-media"
                    >
                        Add New Media
                    </Link>
                </div>
            </div>

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
                        {isLoading && !media.length ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Skeleton key={i} className="h-12 w-full" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-red-500 py-4">
                                    Error loading media
                                </TableCell>
                            </TableRow>
                        ) : filteredMedia.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No media matches your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMedia.map((item) => (
                                <TableRow key={item.mediaId}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.type === "Movie" ? "default" : "secondary"}>
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
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div ref={loaderRef} className="py-4">
                {isFetchingNextPage && (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                )}
                {!hasNextPage && media.length > 0 && (
                    <p className="text-center text-gray-500 py-4">
                        You've reached the end of the list
                    </p>
                )}
            </div>

            {selectedMedia && (
                <DeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onSubmit={handleDeleteConfirm}
                    initialValues={selectedMedia}
                    loading={deleteMutation.isPending}
                />
            )}

            {selectedMedia && (
                <UpdateModal
                    isOpen={formModalOpen}
                    onClose={() => setFormModalOpen(false)}
                    initialValues={selectedMedia}
                />
            )}
        </div>
    );
};
