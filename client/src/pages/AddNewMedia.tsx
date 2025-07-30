import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { axiosInstance } from "@/api/axios";
import { toast } from "sonner";
import { useUser } from "@/recoil/useUser";
export const AddNewMedia = () => {
  const navigate = useNavigate();
  const { getUserAtom } = useUser();
  const user = getUserAtom();
 

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    director: "",
    duration: "",
    budget: "",
    location: "",
    year: "",
    userId: user?.userId,
    posterUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const cloudinaryCloude = import.meta.env.VITE_CLOUDE_NAME;
  const cloudinaryUploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      director: "",
      duration: "",
      budget: "",
      location: "",
      year: "",
      userId: user?.userId,
      posterUrl: "",
    });
    setErrors({});
    setServerError("");
  };
  console.log(formData);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "title",
      "type",
      "director",
      "duration",
      "budget",
      "location",
      "year",
      "posterUrl",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (!formData.posterUrl) {
      newErrors.posterUrl = "Poster image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", cloudinaryUploadPreset);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/media/add-media", formData);

      if (response.status === 201) {
        toast.success("Media created successfully");
        resetForm();
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Error creating media:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create media";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, posterUrl: "" }));
    const fileInput = document.getElementById("poster") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Add New Media</h1>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter media title"
            />
            {errors.title && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.title}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="Movie">Movie</option>
              <option value="TVshow">TV Show</option>
            </select>
            {errors.type && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.type}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director *</Label>
            <Input
              id="director"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              placeholder="Enter director name"
            />
            {errors.director && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.director}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 120 minutes or 1h 30m"
            />
            {errors.duration && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.duration}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget *</Label>
            <Input
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="e.g., $50,000,000"
            />
            {errors.budget && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.budget}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Filming location"
            />
            {errors.location && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.location}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 5}
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Release year"
            />
            {errors.year && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.year}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="poster">Poster Image *</Label>
            <Input
              id="poster"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-gray-500">
              Supported formats: JPEG, JPG, PNG, WebP (Max size: 5MB)
            </p>
            {uploading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-500">Uploading image...</p>
              </div>
            )}
            {errors.posterUrl && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.posterUrl}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {formData.posterUrl && (
            <div className="flex flex-col items-center space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <img
                  src={formData.posterUrl}
                  alt="Poster preview"
                  className="max-h-60 max-w-full rounded-md object-contain"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="text-red-500 hover:text-red-700"
              >
                Remove Image
              </Button>
            </div>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
              disabled={isLoading || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading || !formData.posterUrl}
            >
              {isLoading ? "Creating..." : "Create Media"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
