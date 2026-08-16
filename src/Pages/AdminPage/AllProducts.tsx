/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Edit,
  Eye,
  Trash2,
  ArrowUpDown,
  Plus,
  Search,
  Filter,
  Utensils,
  Star,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteFoodItemMutation,
  useGetAllFoodItemsQuery,
} from "../../Redux/features/items/itemsApi";
import Loader from "../../utils/Loader";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const ITEMS_PER_PAGE = 8;

const AllFoods = () => {
  const { data: responseData, isLoading } = useGetAllFoodItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }) as { data: any; isLoading: boolean };

  const [deleteFoodItem] = useDeleteFoodItemMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<keyof FoodItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Normalize data payload safely
  const rawFoods: FoodItem[] = useMemo(() => {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.data?.result))
      return responseData.data.result;
    return [];
  }, [responseData]);

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set(rawFoods.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rawFoods]);

  // Handle Search, Category Filter, and Sorting
  const filteredAndSortedFoods = useMemo(() => {
    let result = [...rawFoods];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] ?? "";
        const valB = b[sortField] ?? "";

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rawFoods, searchTerm, selectedCategory, sortField, sortDirection]);

  // Pagination Logic
  const totalPages =
    Math.ceil(filteredAndSortedFoods.length / ITEMS_PER_PAGE) || 1;
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedFoods.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedFoods, currentPage]);

  const handleDelete = async (food: FoodItem) => {
    Swal.fire({
      title: "Delete Menu Item?",
      text: `Are you sure you want to remove "${food.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Item",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#334155",
      background: "#0f172a",
      color: "#f8fafc",
      customClass: {
        popup: "rounded-2xl border border-slate-800 shadow-2xl",
        title: "text-xl font-bold text-white",
        htmlContainer: "text-slate-400 text-sm",
        confirmButton:
          "px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer",
        cancelButton:
          "px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFoodItem(food._id).unwrap();
          Swal.fire({
            title: "Item Deleted",
            text: `${food.name} has been removed from the menu.`,
            icon: "success",
            confirmButtonColor: "#f59e0b",
            background: "#0f172a",
            color: "#f8fafc",
            customClass: {
              popup: "rounded-2xl border border-slate-800 shadow-2xl",
              title: "text-xl font-bold text-white",
              htmlContainer: "text-slate-400 text-sm",
              confirmButton:
                "px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer",
            },
          });
        } catch (error: any) {
          const errorMessage =
            error?.data?.message || "Failed to delete item from menu.";
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            background: "#0f172a",
            color: "#f8fafc",
          });
        }
      }
    });
  };

  const handleSort = (field: keyof FoodItem) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `৳${price?.toFixed(2) || "0.00"}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Utensils size={14} /> Kitchen Inventory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              All Dishes & Menu Items
            </h1>
          </div>
          <Link to="/dashboard/items/add-item">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition-all cursor-pointer">
              <Plus size={16} /> Add New Dish
            </button>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search dish name or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 capitalize focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 whitespace-nowrap">
              Total:{" "}
              <span className="text-amber-400">
                {filteredAndSortedFoods.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse hidden lg:table">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-semibold tracking-wider">
                  <th className="px-6 py-4">Dish</th>
                  <th className="px-6 py-4">
                    <button
                      onClick={() => handleSort("category")}
                      className="group inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                    >
                      <span>Category</span>
                      <ArrowUpDown
                        size={13}
                        className="text-slate-600 group-hover:text-amber-400"
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button
                      onClick={() => handleSort("price")}
                      className="group inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                    >
                      <span>Price</span>
                      <ArrowUpDown
                        size={13}
                        className="text-slate-600 group-hover:text-amber-400"
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button
                      onClick={() => handleSort("isAvailable")}
                      className="group inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                    >
                      <span>Status</span>
                      <ArrowUpDown
                        size={13}
                        className="text-slate-600 group-hover:text-amber-400"
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4">
                    <button
                      onClick={() => handleSort("rating")}
                      className="group inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                    >
                      <span>Rating</span>
                      <ArrowUpDown
                        size={13}
                        className="text-slate-600 group-hover:text-amber-400"
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4">Added Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <AnimatePresence>
                  {paginatedFoods.length > 0 ? (
                    paginatedFoods.map((food) => (
                      <motion.tr
                        key={food._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-800/40 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                food.image ||
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
                              }
                              alt={food.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-950"
                            />
                            <div>
                              <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                                {food.name}
                                {food.isPopular && (
                                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Flame size={10} /> Popular
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                                {food.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                            {food.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-200">
                          {formatPrice(food.price)}
                        </td>
                        <td className="px-6 py-4">
                          {food.isAvailable ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Unavailable
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-amber-400 font-semibold">
                            <Star
                              size={12}
                              className="fill-amber-400 text-amber-400"
                            />
                            <span>
                              {food.rating ? food.rating.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {formatDate(food.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <Link to={`/dashboard/items/view-item/${food._id}`}>
                              <button
                                title="View Details"
                                className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-slate-800 transition-colors cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                            </Link>
                            <button
                              title="Edit Item"
                              className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(food)}
                              title="Delete Item"
                              className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-12 text-slate-500"
                      >
                        No dishes found matching your criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Mobile/Tablet View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
              {paginatedFoods.map((food) => (
                <div
                  key={food._id}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={
                        food.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
                      }
                      alt={food.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-200 truncate">
                          {food.name}
                        </h3>
                        <div className="flex gap-1 shrink-0">
                          <Link to={`/dashboard/items/view-item/${food._id}`}>
                            <button className="p-1.5 bg-slate-950 text-sky-400 border border-slate-800 rounded-lg">
                              <Eye size={13} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(food)}
                            className="p-1.5 bg-slate-950 text-rose-400 border border-slate-800 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {food.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
                    <div>
                      <span className="text-slate-500 text-[10px]">
                        Category
                      </span>
                      <p className="font-semibold text-slate-300 capitalize">
                        {food.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Price</span>
                      <p className="font-bold text-amber-400">
                        {formatPrice(food.price)}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-1">
                      {food.isAvailable ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Unavailable
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star size={11} className="fill-amber-400" />
                        <span>
                          {food.rating ? food.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/40 text-xs">
              <span className="text-slate-500">
                Page{" "}
                <span className="text-slate-200 font-bold">{currentPage}</span>{" "}
                of{" "}
                <span className="text-slate-200 font-bold">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFoods;
