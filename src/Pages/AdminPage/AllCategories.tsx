/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  Plus,
  UtensilsCrossed,
  Search,
  Grid,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useGetAllCategoriesQuery } from "../../Redux/features/categories/categoryApi";
import { useGetAllFoodItemsQuery } from "../../Redux/features/items/itemsApi";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  category: string;
  name?: string;
}

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

interface ApiDataResponse<T> {
  data?: T[];
}

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const AllCategories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery<Category[] | ApiDataResponse<Category> | any>(
      undefined,
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    );

  const { data: rawProducts } = useGetAllFoodItemsQuery<
    Product[] | ApiDataResponse<Product> | any
  >(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const categories: Category[] = useMemo(() => {
    if (Array.isArray(rawCategories)) return rawCategories;
    if (
      rawCategories &&
      "data" in rawCategories &&
      Array.isArray(rawCategories.data)
    ) {
      return rawCategories.data;
    }
    return [];
  }, [rawCategories]);

  const products: Product[] = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (
      rawProducts &&
      "data" in rawProducts &&
      Array.isArray(rawProducts.data)
    ) {
      return rawProducts.data;
    }
    return [];
  }, [rawProducts]);

  const getProductCountByCategory = (categoryName: string): number => {
    return products.filter((product) => product?.category === categoryName)
      .length;
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  if (isLoadingCategories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-amber-400 gap-3">
        <Loader />
        <p className="text-xs text-slate-400 tracking-wider">
          Loading Menu Categories...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen text-slate-100"
    >
      {/* Top Header & Actions Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Menu Categories
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 pl-1">
            Manage food sections, view linked items, and optimize your inventory
            layout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          {/* Fixed Add Category Link/Button */}
          <Link
            to="/dashboard/categories/add-category"
            className="inline-block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Category</span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Grid Display */}
      {filteredCategories.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category) => {
              const itemCount = getProductCountByCategory(category.name);

              return (
                <motion.div
                  key={category._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  layout
                  className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Category Image Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Floating Item Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-lg">
                        <Tag className="w-3 h-3" />
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-bold text-white tracking-wide truncate group-hover:text-amber-400 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-slate-900/80 flex items-center justify-between border-t border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Grid className="w-3 h-3 text-slate-400" /> Active
                      Category
                    </span>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 rounded-xl transition-all"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-2xl max-w-md mx-auto my-12 p-8"
        >
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No Categories Match Your Query
          </h3>
          <p className="text-slate-400 text-xs mb-6">
            {searchTerm
              ? `No result found for "${searchTerm}". Try a different search term.`
              : "Get started by creating your first menu category."}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              Clear Search
            </button>
          ) : (
            <Link
              to="/dashboard/categories/add-category"
              className="inline-block"
            >
              <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10">
                Create Category
              </button>
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AllCategories;
