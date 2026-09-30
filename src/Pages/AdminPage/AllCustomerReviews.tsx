// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { useGetAllReviewsQuery } from "../../Redux/features/items/itemsApi";
// import {
//   Star,
//   MessageSquare,
//   User,
//   Calendar,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   RefreshCw,
//   ShoppingBag,
// } from "lucide-react";

// // Interface based on your JSON structure
// export interface IReviewItem {
//   _id: string;
//   orderId: string;
//   foodId: string | { _id: string; name?: string; image?: string };
//   userId: string;
//   userName: string;
//   rating: number;
//   comment: string;
//   status: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const ITEMS_PER_PAGE = 6;

// const AllCustomerReviews: React.FC = () => {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetAllReviewsQuery(undefined);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedRating, setSelectedRating] = useState<string>("all");

//   // Extract array from response payload safely
//   const rawReviews: IReviewItem[] = response?.data || response || [];

//   // Filter & Sort (Newest first)
//   const filteredReviews = rawReviews
//     .filter((rev) => {
//       const matchesSearch =
//         rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         rev.orderId.includes(searchTerm);
//       const matchesRating =
//         selectedRating === "all" ? true : rev.rating === Number(selectedRating);
//       return matchesSearch && matchesRating;
//     })
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//     );

//   // Pagination Math
//   const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentReviews = filteredReviews.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE,
//   );

//   // Stats calculation
//   const totalReviewsCount = rawReviews.length;
//   const avgRating = totalReviewsCount
//     ? (
//         rawReviews.reduce((acc, curr) => acc + curr.rating, 0) /
//         totalReviewsCount
//       ).toFixed(1)
//     : "0.0";

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
//               <MessageSquare className="w-7 h-7 text-amber-400" />
//               Customer Reviews Management
//             </h1>
//             <p className="text-sm text-slate-400 mt-1">
//               Monitor, filter, and review customer feedback for FoodieHub
//               orders.
//             </p>
//           </div>

//           <button
//             onClick={() => refetch()}
//             className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
//           >
//             <RefreshCw className="w-3.5 h-3.5" />
//             <span>Refresh Data</span>
//           </button>
//         </div>

//         {/* Analytics Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
//             <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
//               <Star className="w-6 h-6 fill-amber-400" />
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
//                 Average Rating
//               </p>
//               <h3 className="text-2xl font-bold text-white mt-0.5">
//                 {avgRating} / 5.0
//               </h3>
//             </div>
//           </div>

//           <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
//             <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400">
//               <MessageSquare className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
//                 Total Reviews
//               </p>
//               <h3 className="text-2xl font-bold text-white mt-0.5">
//                 {totalReviewsCount}
//               </h3>
//             </div>
//           </div>

//           <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
//             <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
//               <ShoppingBag className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
//                 Active Status
//               </p>
//               <h3 className="text-2xl font-bold text-white mt-0.5">
//                 100% Published
//               </h3>
//             </div>
//           </div>
//         </div>

//         {/* Filter and Search Controls */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
//           <div className="relative w-full sm:w-80">
//             <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search by customer name, order ID..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
//             />
//           </div>

//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
//             <select
//               value={selectedRating}
//               onChange={(e) => {
//                 setSelectedRating(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full sm:w-auto px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
//             >
//               <option value="all">All Ratings</option>
//               <option value="5">5 Stars</option>
//               <option value="4">4 Stars</option>
//               <option value="3">3 Stars</option>
//               <option value="2">2 Stars</option>
//               <option value="1">1 Star</option>
//             </select>
//           </div>
//         </div>

//         {/* Error State */}
//         {isError && (
//           <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
//             <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
//             <h3 className="text-base font-bold text-red-200">
//               Failed to load reviews
//             </h3>
//             <p className="text-xs text-red-400 max-w-md mx-auto">
//               {(error as any)?.data?.message ||
//                 "Internal server error occurred while retrieving data."}
//             </p>
//             <button
//               onClick={() => refetch()}
//               className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-xl text-xs font-semibold transition-all"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Loading Skeleton Grid */}
//         {isLoading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div
//                 key={i}
//                 className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse space-y-4"
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="h-4 w-28 bg-slate-800 rounded" />
//                   <div className="h-4 w-16 bg-slate-800 rounded" />
//                 </div>
//                 <div className="h-3 w-3/4 bg-slate-800 rounded" />
//                 <div className="h-12 bg-slate-950 rounded-xl" />
//                 <div className="h-3 w-1/2 bg-slate-800 rounded" />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Review Cards Grid */}
//         {!isLoading && !isError && currentReviews.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {currentReviews.map((review) => (
//               <div
//                 key={review._id}
//                 className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between space-y-4 group"
//               >
//                 <div className="space-y-3">
//                   {/* Top Bar: User & Stars */}
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="flex items-center gap-2.5">
//                       <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">
//                         {review.userName ? (
//                           review.userName.charAt(0).toUpperCase()
//                         ) : (
//                           <User className="w-4 h-4" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <h4 className="text-sm font-bold text-white truncate">
//                           {review.userName || "Anonymous"}
//                         </h4>
//                         <p className="text-[10px] text-slate-500 truncate">
//                           ID: {review.userId}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Rating Stars Badge */}
//                     <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 shrink-0">
//                       <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
//                       <span className="text-xs font-bold text-amber-400">
//                         {review.rating}.0
//                       </span>
//                     </div>
//                   </div>

//                   {/* Comment Section */}
//                   <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60 min-h-[70px]">
//                     <p className="text-xs text-slate-300 leading-relaxed italic">
//                       &quot;{review.comment}&quot;
//                     </p>
//                   </div>
//                 </div>

//                 {/* Footer Metadata */}
//                 <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
//                   <div className="flex items-center gap-1 truncate max-w-[150px]">
//                     <ShoppingBag className="w-3 h-3 text-slate-500 shrink-0" />
//                     <span className="truncate">
//                       Order: #{review.orderId.slice(-6)}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1 shrink-0">
//                     <Calendar className="w-3 h-3 text-slate-500" />
//                     <span>
//                       {new Date(review.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && !isError && currentReviews.length === 0 && (
//           <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/80 space-y-3">
//             <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
//             <h3 className="text-base font-bold text-slate-300">
//               No reviews found
//             </h3>
//             <p className="text-xs text-slate-500">
//               There are no customer reviews matching your current filters.
//             </p>
//           </div>
//         )}

//         {/* Pagination Bar */}
//         {!isLoading && !isError && totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
//             <p className="text-xs text-slate-400">
//               Showing{" "}
//               <span className="text-white font-semibold">{startIndex + 1}</span>{" "}
//               to{" "}
//               <span className="text-white font-semibold">
//                 {Math.min(startIndex + ITEMS_PER_PAGE, filteredReviews.length)}
//               </span>{" "}
//               of{" "}
//               <span className="text-white font-semibold">
//                 {filteredReviews.length}
//               </span>{" "}
//               reviews
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>

//               <span className="text-xs text-slate-300 px-3 font-semibold">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCustomerReviews;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useGetAllReviewsQuery } from "../../Redux/features/items/itemsApi";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

// Interface based on your JSON structure
export interface IReviewItem {
  _id: string;
  orderId: string;
  foodId: string | { _id: string; name?: string; image?: string };
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewsResponse {
  data?: IReviewItem[];
  success?: boolean;
  message?: string;
}

const ITEMS_PER_PAGE = 6;

const AllCustomerReviews: React.FC = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllReviewsQuery(undefined) as {
    data: IReviewsResponse | IReviewItem[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("all");

  // Extract array from response payload safely
  const rawReviews: IReviewItem[] = Array.isArray(response)
    ? response
    : response?.data || [];

  // Filter & Sort (Newest first)
  const filteredReviews = rawReviews
    .filter((rev) => {
      const matchesSearch =
        rev.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.orderId?.includes(searchTerm);
      const matchesRating =
        selectedRating === "all" ? true : rev.rating === Number(selectedRating);
      return matchesSearch && matchesRating;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  // Pagination Math
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Stats calculation
  const totalReviewsCount = rawReviews.length;
  const avgRating = totalReviewsCount
    ? (
        rawReviews.reduce((acc, curr) => acc + curr.rating, 0) /
        totalReviewsCount
      ).toFixed(1)
    : "0.0";

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-amber-400" />
              Customer Reviews Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor, filter, and review customer feedback for FoodieHub
              orders.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Average Rating
              </p>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                {avgRating} / 5.0
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Reviews
              </p>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                {totalReviewsCount}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Active Status
              </p>
              <h3 className="text-2xl font-bold text-white mt-0.5">
                100% Published
              </h3>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, order ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-red-200">
              Failed to load reviews
            </h3>
            <p className="text-xs text-red-400 max-w-md mx-auto">
              {(error as any)?.data?.message ||
                "Internal server error occurred while retrieving data."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                  <div className="h-4 w-16 bg-slate-800 rounded" />
                </div>
                <div className="h-3 w-3/4 bg-slate-800 rounded" />
                <div className="h-12 bg-slate-950 rounded-xl" />
                <div className="h-3 w-1/2 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Review Cards Grid */}
        {!isLoading && !isError && currentReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentReviews.map((review) => (
              <div
                key={review._id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: User & Stars */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">
                        {review.userName ? (
                          review.userName.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {review.userName || "Anonymous"}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          ID: {review.userId}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars Badge */}
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-400">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Comment Section */}
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60 min-h-[70px]">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[150px]">
                    <ShoppingBag className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">
                      Order: #{review.orderId?.slice(-6)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && currentReviews.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/80 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">
              No reviews found
            </h3>
            <p className="text-xs text-slate-500">
              There are no customer reviews matching your current filters.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="text-white font-semibold">{startIndex + 1}</span>{" "}
              to{" "}
              <span className="text-white font-semibold">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredReviews.length)}
              </span>{" "}
              of{" "}
              <span className="text-white font-semibold">
                {filteredReviews.length}
              </span>{" "}
              reviews
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-300 px-3 font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCustomerReviews;
