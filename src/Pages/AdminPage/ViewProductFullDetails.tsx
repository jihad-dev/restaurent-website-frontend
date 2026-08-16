/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Utensils,
  Star,
  CheckCircle2,
  XCircle,
  Flame,
  Tag,
  DollarSign,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";
import {
  useGetFoodByIdQuery,
  useDeleteFoodItemMutation,
} from "../../Redux/features/items/itemsApi";

export interface IFood {
  _id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable?: boolean;
  rating?: number;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ViewFoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: rawResponse,
    isLoading,
    isError,
    error,
  } = useGetFoodByIdQuery(id as string, {
    skip: !id,
  }) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };

  const [deleteFoodItem, { isLoading: isDeleting }] =
    useDeleteFoodItemMutation();

  // Safely extract food payload across API wrapper patterns
  const food: IFood | null = rawResponse?.data || rawResponse || null;

  const handleDelete = async () => {
    if (!food?._id) return;

    Swal.fire({
      title: "Delete Menu Item?",
      text: `Are you sure you want to delete "${food.name}"? This action cannot be undone.`,
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
          await deleteFoodItem(food._id!).unwrap();
          await Swal.fire({
            title: "Deleted!",
            text: `${food.name} has been removed from the menu.`,
            icon: "success",
            confirmButtonColor: "#f59e0b",
            background: "#0f172a",
            color: "#f8fafc",
          });
          navigate("/dashboard/items");
        } catch (err: any) {
          Swal.fire({
            title: "Error",
            text: err?.data?.message || "Failed to delete the item.",
            icon: "error",
            background: "#0f172a",
            color: "#f8fafc",
          });
        }
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !food) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Item Not Found</h2>
          <p className="text-xs text-slate-400">
            {error?.data?.message ||
              "The food item you are looking for does not exist or has been removed."}
          </p>
          <Link to="/dashboard/items" className="inline-block pt-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
              Return to Inventory
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-0.5">
                <Utensils size={13} /> Dish Overview
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white truncate max-w-md">
                {food.name}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/items/edit-item/${food._id}`}>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer">
                <Edit size={14} /> Edit Dish
              </button>
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Preview & Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Primary Visual Display */}
            <div className="relative group bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 overflow-hidden shadow-xl backdrop-blur-xl">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 relative">
                <img
                  src={
                    food.image ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
                  }
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {food.isPopular && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-500/90 text-slate-950 shadow-lg backdrop-blur-md">
                      <Flame size={12} className="fill-slate-950" /> Popular
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900/90 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-xl">
                    ৳{food.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    food.isAvailable
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {food.isAvailable ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Status
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {food.isAvailable ? "In Stock & Ready" : "Unavailable"}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star size={18} className="fill-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Customer Rating
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {food.rating
                      ? `${food.rating.toFixed(1)} / 5.0`
                      : "Not Rated"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Detailed Item Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Core Info Panel */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-xl space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 border border-slate-700/80">
                    {food.category || "General"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{food.name}</h2>
              </div>

              <div className="border-t border-b border-slate-800/80 py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {food.description ||
                    "No description available for this item."}
                </p>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
                  <Tag size={16} className="text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Category
                    </div>
                    <div className="text-xs font-bold text-slate-200 capitalize">
                      {food.category}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
                  <DollarSign size={16} className="text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Base Price
                    </div>
                    <div className="text-xs font-bold text-amber-400">
                      ৳{food.price?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
                  <Calendar size={16} className="text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Date Added
                    </div>
                    <div className="text-xs font-semibold text-slate-300 font-mono">
                      {formatDate(food.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
                  <Clock size={16} className="text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Last Updated
                    </div>
                    <div className="text-xs font-semibold text-slate-300 font-mono">
                      {formatDate(food.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Audit Meta Box */}
            <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Item ID: {food._id}</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Database Synced
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ViewFoodDetails;
