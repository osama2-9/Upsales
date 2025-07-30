import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Media } from "@/types/Media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { InputGroup } from "../InputGroup";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Media;
}

export const UpdateModal = ({
  isOpen,
  onClose,
  initialValues,
}: UpdateModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const cloudinaryCloude = import.meta.env.VITE_CLOUDE_NAME;
  const cloudinaryUploadrePreset = import.meta.env.VITE_UPLOAD_PRESET;
  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialValues ?? {
          mediaId: 0,
          title: "",
          director: "",
          duration: "",
          budget: "",
          location: "",
          posterUrl: "",
          type: "Movie",
          year: "",
          user: { name: "" },
          createdAt: "",
          updatedAt: "",
        }
      );
    } else {
      setFormData(null);
    }
  }, [isOpen, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", cloudinaryUploadrePreset);

    try {
      const res = await fetch(
        `${cloudinaryUrl}/${cloudinaryCloude}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        setFormData({ ...formData, posterUrl: data.secure_url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: Media) => axiosInstance.put(`/media/update-media`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media updated successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update media");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) updateMutation.mutate(formData);
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Update Media" : "Add New Media"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <InputGroup
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <select
              id="type"
              name="type"
              className="col-span-3 border rounded-md p-2"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Movie">Movie</option>
              <option value="TVshow">TV Show</option>
            </select>
          </div>

          <InputGroup
            label="Director"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />

          <InputGroup
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />

          <InputGroup
            label="Budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />

          <InputGroup
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <InputGroup
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="poster" className="text-right">
              Poster Image
            </Label>
            <div className="col-span-3">
              <Input
                id="poster"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>
          </div>

          {formData.posterUrl && (
            <div className="flex justify-center">
              <img
                src={formData.posterUrl}
                alt="Poster"
                className="max-h-40 rounded-md"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
