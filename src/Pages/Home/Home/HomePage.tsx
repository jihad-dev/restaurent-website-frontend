
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import Header from "../../../components/Shared/Header";
import { HeroBanner } from "./Banner";
import { useGetPopularFoodsQuery } from "../../../Redux/features/items/itemsApi";

// Food Item Type Definition
export interface IFoodItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  badge?: string;
  description: string;
  isPopular?: boolean;
}

// Response Wrapper Type
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export const HomePage: React.FC = () => {
  // Fetch items without any filter/pagination parameters
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPopularFoodsQuery(undefined);


  // Normalize Data safely without type errors
  const foodItems: IFoodItem[] = useMemo(() => {
    if (!responseData) return [];
    if (Array.isArray(responseData)) return responseData as IFoodItem[];

    // Type guard check for .data property
    if (typeof responseData === "object" && "data" in responseData) {
      const apiRes = responseData as ApiResponse<IFoodItem[]>;
      return Array.isArray(apiRes.data) ? apiRes.data : [];
    }

    return [];
  }, [responseData]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* 1. Header Component */}
      <Header />

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* HERO BANNER SECTION */}
        <section className="mt-4 mb-8">
          <HeroBanner />
        </section>

        {/* FOOD ITEMS SECTION */}
        <section id="menu" className="my-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" /> Trending Dishes
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Popular Items
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore customer favorites crafted with fresh ingredients
              </p>
            </div>
            {!isLoading && !isError && (
              <span className="text-xs text-slate-400 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                Showing {foodItems.length} items
              </span>
            )}
          </div>

          {/* LOADING SKELETON STATE */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800/80 rounded-3xl p-4 animate-pulse space-y-4"
                >
                  <div className="h-48 bg-slate-800 rounded-2xl w-full" />
                  <div className="h-5 bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-800 rounded-md w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-slate-800 rounded-md w-1/4" />
                    <div className="h-10 bg-slate-800 rounded-xl w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/80 border border-red-500/30 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 space-y-4"
            >
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                Failed to Load Popular Items
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {error && typeof error === "object" && "data" in error
                  ? ((error as any).data?.message ?? "Failed to fetch data")
                  : "Something went wrong while fetching popular items. Please check your network connection."}
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Again
              </button>
            </motion.div>
          )}

          {/* FOOD ITEMS GRID */}
          {!isLoading && !isError && (
            <AnimatePresence>
              {foodItems.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {foodItems.map((dish) => {
                    const itemId = dish._id || dish.id;
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={itemId}
                        className="group bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Image & Badge Container */}
                        <div>
                          <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {dish.badge && (
                              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                                {dish.badge}
                              </span>
                            )}
                            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              {dish.rating ?? 4.8}
                            </div>
                          </div>

                          {/* Dish Details */}
                          <div className="px-1">
                            <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-400 transition-colors">
                              {dish.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        {/* Price & Action Button */}
                        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between px-1">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                              Price
                            </span>
                            <span className="text-lg font-black text-white">
                              ${dish.price?.toFixed(2)}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                /* EMPTY STATE */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl"
                >
                  <p className="text-slate-400 text-sm font-medium">
                    No popular items found.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </main>
    </div>
  );
};
