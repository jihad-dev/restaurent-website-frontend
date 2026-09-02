/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate
import { useGetAllFoodItemsQuery } from "../../Redux/features/items/itemsApi";
import { useAddToCartMutation } from "../../Redux/features/cart/cartApi";
import { toast } from "sonner";
import {
  Search,
  Utensils,
  Star,
  Plus,
  Flame,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAppSelector } from "../../Redux/hooks";

export interface IFoodItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  image: string;
  description: string;
  isPopular?: boolean;
}

const FoodItems: React.FC = () => {
  const navigate = useNavigate(); // 👈 Initialize navigate hook
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: foodResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllFoodItemsQuery(undefined);

  const [addToCart] = useAddToCartMutation();

  // State to track which item is currently being added to cart
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const foodsList: IFoodItem[] = useMemo(() => {
    if (!foodResponse) return [];
    return Array.isArray(foodResponse) ? foodResponse : [];
  }, [foodResponse]);

  const categories = useMemo(() => {
    const cats = new Set(
      foodsList.map((item) => item.category).filter(Boolean),
    );
    return ["All", ...Array.from(cats)];
  }, [foodsList]);

  const filteredFoods = useMemo(() => {
    let result = [...foodsList];

    if (searchQuery.trim()) {
      result = result.filter((food) =>
        food.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((food) => food.category === selectedCategory);
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
      );
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return result;
  }, [foodsList, searchQuery, selectedCategory, sortBy]);

  // Handle adding item to cart with auth checking and loading state
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    foodId: string,
  ) => {
    e.stopPropagation();

    // 🔒 Auth Check: If not logged in, notify and redirect
    if (!user) {
      toast.error("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    setLoadingItemId(foodId);

    try {
      await addToCart({
        foodId,
        productId: foodId,
        product: foodId,
        quantity: 1,
      }).unwrap();

      toast.success("Item added to cart successfully!");
    } catch (error: any) {
      console.error("Cart error:", error);
      const errorMsg =
        error?.data?.message ||
        "Failed to add item to cart. Product not found.";
      toast.error(errorMsg);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }
      `}</style>

      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-14 px-4 text-center overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 " /> Delicious Selection
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore Our Special Menu
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Discover culinary excellence with fresh ingredients and
            extraordinary flavors prepared just for you.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Controls Bar */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-800 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-all active:scale-95"
                title="Refresh Menu"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    isFetching ? "animate-spin text-amber-400" : ""
                  }`}
                />
              </button>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                >
                  <option value="default">Default Sort</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-3 border-t border-slate-800/80 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                      : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div
                key={index}
                className="relative bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-800/40 to-transparent z-10 pointer-events-none" />
                <div>
                  <div className="w-full h-44 bg-slate-800/60 rounded-xl mb-4 relative overflow-hidden" />
                  <div className="w-20 h-3 bg-slate-800/60 rounded-full mb-2" />
                  <div className="w-3/4 h-5 bg-slate-800/60 rounded-md mb-2" />
                  <div className="space-y-1.5 mb-4">
                    <div className="w-full h-3 bg-slate-800/40 rounded-md" />
                    <div className="w-2/3 h-3 bg-slate-800/40 rounded-md" />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  <div className="w-16 h-6 bg-slate-800/60 rounded-md" />
                  <div className="w-20 h-9 bg-slate-800/60 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {isError && !isLoading && (
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-slate-900 rounded-2xl border border-red-900/40 shadow-xl">
            <div className="w-12 h-12 bg-red-950/80 text-red-400 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">
              Failed to load menu
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              There was an issue connecting to the server. Please check your
              network or backend service.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-all shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && filteredFoods.length === 0 && (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
            <Utensils className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-200">
              No Food Items Found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        )}

        {/* FOOD ITEMS GRID */}
        {!isLoading && !isError && filteredFoods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="group bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <img
                      src={
                        food.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {food.isPopular && (
                      <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Flame className="w-3 h-3 fill-slate-950" /> Hot
                      </span>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-800">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {food.rating ?? "4.5"}
                    </div>
                  </div>

                  {/* Details */}
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                    {food.category}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {food.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {food.description}
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-100">
                      ৳{food.discountPrice ?? food.price}
                    </span>
                    {food.discountPrice && food.discountPrice < food.price && (
                      <span className="text-xs text-slate-500 line-through ml-1.5">
                        ৳{food.price}
                      </span>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    type="button"
                    disabled={loadingItemId === food._id}
                    onClick={(e) => handleAddToCart(e, food._id)}
                    className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loadingItemId === food._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                    <span >
                      {loadingItemId === food._id ? "Adding..." : "Add"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodItems;
