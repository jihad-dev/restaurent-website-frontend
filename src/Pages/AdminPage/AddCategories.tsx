/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useAddCategoryMutation } from "../../Redux/features/categories/categoryApi";
import { motion } from "framer-motion";
import { Loader2, Upload, X, Layers, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Loader from "../../utils/Loader";

interface CategoryState {
  name: string;
  image: string;
}

const AddCategories = () => {
  const [category, setCategory] = useState<CategoryState>({
    name: "",
    image: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const uploadPreset = "image_upload";
    formData.append("upload_preset", uploadPreset);
    const cloudName = "drvenvkge";
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Cloudinary upload failed");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        `Image upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      setCategory((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!category.image) {
      toast.error("Please upload a category image");
      return;
    }

    let toastId: string | number | undefined = undefined;

    try {
      toastId = toast.loading("Adding category...");
      await addCategory(category).unwrap();
      toast.success("Category added successfully!", { id: toastId });
      setCategory({
        name: "",
        image: "",
      });
    } catch (error) {
      let errorMessage = "An unknown error occurred while adding category";
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        (error as any).data?.message
      ) {
        errorMessage = (error as any).data.message;
      }
      toast.error(errorMessage, {
        id: toastId,
        duration: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 sm:px-8 border-b border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Add Menu Category
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Organize your dishes and menu sections for seamless order
                management.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Category Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all duration-200"
                required
                placeholder="e.g., Appetizers, Main Course, Beverages"
                autoComplete="off"
                maxLength={50}
              />
            </div>

            {/* Category Image Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Category Cover Image <span className="text-amber-400">*</span>
              </label>

              <div
                className={`relative min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${
                  isDragging
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {!category.image ? (
                  <div className="p-6 text-center flex flex-col items-center">
                    <div className="p-4 bg-slate-800/50 rounded-full mb-3 text-slate-400 border border-slate-700/50">
                      <Upload className="h-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex text-xs text-slate-300 gap-1 font-medium">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer text-amber-400 hover:text-amber-300 underline font-semibold"
                      >
                        <span>Click to upload</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileInput}
                        />
                      </label>
                      <span>or drag and drop</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, or WEBP up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-60 group">
                    <img
                      src={category.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCategory((prev) => ({ ...prev, image: "" }))
                        }
                        className="p-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                    <Loader />
                    <span className="text-xs font-medium text-amber-400">
                      Uploading Image...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-amber-500/10"
              >
                {isLoading || isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Category...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Save Category</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCategories;
