/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "../../Redux/features/categories/categoryApi";
import { useAddFoodItemMutation } from "../../Redux/features/items/itemsApi";

interface Category {
  _id?: string;
  name: string;
}
//  TODO:
interface ProductState {
  name: string;
  category: string;
  price: number | "";
  description: string;
  image: string;
  isAvailable: boolean;
  rating: number | "";
  isPopular: boolean;
  tagsInput: string;
}

const AddItemsForm = () => {
  const [product, setProduct] = useState<ProductState>({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    isAvailable: true,
    rating: 0,
    isPopular: false,
    tagsInput: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [addProduct, { isLoading }] = useAddFoodItemMutation();

  const { data: categories } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as { data?: Category[] };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setProduct((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image_upload");
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
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Image upload failed: ${msg}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      e.target.value = "";
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setProduct((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.image) {
      toast.error("Please upload an item image.");
      return;
    }

    const payload = {
      name: product.name,
      category: product.category,
      price: Number(product.price),
      description: product.description,
      image: product.image,
      isAvailable: product.isAvailable,
      rating: product.rating !== "" ? Number(product.rating) : 0,
      isPopular: product.isPopular,
      tags: product.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Adding food item...");
      await addProduct(payload).unwrap();
      toast.success("Food item added successfully!", { id: toastId });

      setProduct({
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
        isAvailable: true,
        rating: 0,
        isPopular: false,
        tagsInput: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add food item!", {
        id: toastId,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-6 text-slate-100 my-10"
    >
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Add New Food Item
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure item details and submit to menu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Item Name *
            </label>
            <input
              required
              type="text"
              name="name"
              placeholder="e.g. Cheese Burger"
              value={product.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              required
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="" disabled className="text-slate-500">
                Select a category
              </option>
              {categories?.map((cat) => (
                <option
                  key={cat._id || cat.name}
                  value={cat.name}
                  className="bg-slate-900 text-slate-100"
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Price (৳) *
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              name="price"
              placeholder="0.00"
              value={product.price}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Rating (0 - 5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              name="rating"
              placeholder="4.5"
              value={product.rating}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              name="tagsInput"
              placeholder="spicy, bestseller, fastfood"
              value={product.tagsInput}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={product.isAvailable}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-slate-300">
                Available in Stock
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPopular"
                checked={product.isPopular}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-slate-300">
                Mark as Popular
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Brief description of the food item..."
          value={product.description}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Item Image *
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative w-32 h-32 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden group hover:border-slate-500 transition-colors">
            {product.image ? (
              <>
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setProduct((prev) => ({ ...prev, image: "" }))}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 transition-colors"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="text-center p-2">
                {isUploading ? (
                  <span className="text-xs text-indigo-400 font-medium animate-pulse">
                    Uploading...
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-indigo-400 text-xl font-bold">+</span>
                    <span className="text-xs text-slate-400 mt-1">
                      Upload Image
                    </span>
                  </div>
                )}
              </div>
            )}
            {!product.image && !isUploading && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
          {product.image && (
            <p className="text-xs text-emerald-400 font-medium">
              ✓ Image uploaded
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 text-right">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Adding..."
            : isUploading
              ? "Uploading Image..."
              : "Add Food Item"}
        </button>
      </div>
    </form>
  );
};

export default AddItemsForm;
