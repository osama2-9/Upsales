import { useEffect, useRef, useState } from "react";
import { useGetMedia } from "../hooks/useGetMedia";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/recoil/useUser";

const HomePage = () => {
const {getUserAtom} = useUser()
const user = getUserAtom()
const isAdmin = user?.isAdmin
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Movie" | "TVshow">("all");
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    media,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMedia();

  const filteredMedia = media.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
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

  if (isLoading && !media.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error loading media. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Media Library</h1>
      <div className="flex justify-between items-center mb-6">

      {isAdmin && (
          <Button asChild variant="outline">
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        )}
        </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search by title or director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        
        <Tabs 
          value={filterType} 
          onValueChange={(value) => setFilterType(value as "all" | "Movie" | "TVshow")}
          className="md:ml-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Movie">Movies</TabsTrigger>
            <TabsTrigger value="TVshow">TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredMedia.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((media) => (
              <Card key={media.mediaId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{media.title}</CardTitle>
                    <Badge variant={media.type === 'Movie' ? 'default' : 'secondary'}>
                      {media.type}
                    </Badge>
                  </div>
                  <CardDescription>
                    {media.director} • {media.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {media.posterUrl ? (
                    <img 
                      src={media.posterUrl} 
                      alt={`${media.title} poster`}
                      className="w-full h-auto rounded-md mb-4"
                    />
                  ) : (
                    <div className="aspect-[2/3] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <span className="text-gray-400">No poster available</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p><span className="font-medium">Duration:</span> {media.duration}</p>
                    <p><span className="font-medium">Budget:</span> {media.budget}</p>
                    <p><span className="font-medium">Location:</span> {media.location}</p>
                  </div>
                </CardContent>
               
              </Card>
            ))}
          </div>
          
          <div ref={loaderRef} className="py-4">
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
                ))}
              </div>
            )}
            {!hasNextPage && !isFetchingNextPage && (
              <p className="text-center text-gray-500 py-4">
                You've reached the end of the list
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No media found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;