// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Star,
//   ArrowLeft,
//   MessageSquare,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   UtensilsCrossed,
//   Mail,
//   User,
// } from "lucide-react";
// import {
//   useAddReviewMutation,
//   useGetFoodByIdQuery,
// } from "../../Redux/features/items/itemsApi";
// import { useSelector } from "react-redux";
// import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";

// const Review: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // 1. Redux Store থেকে Logged in User ID নেওয়া
//   const user = useSelector((state: any) => state.auth?.user);
//   const currentUserId = user?._id || user?.id;

//   // RTK Query Mutation Hook
//   const [createReview, { isLoading: isSubmitting }] = useAddReviewMutation();

//   // Single User Data Fetch
//   const { data: userDataResponse, isLoading: isUserLoading } =
//     useGetSingleUserQuery(currentUserId, { skip: !currentUserId });

//   const singleUser = userDataResponse?.data || userDataResponse;

//   // Form State & Validation
//   const [rating, setRating] = useState<number>(0);
//   const [hoverRating, setHoverRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>("");
//   const [validationError, setValidationError] = useState<string>("");
//   const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

//   // Dynamic Product Data from RTK Query
//   const {
//     data: responseData,
//     isLoading: isFoodLoading,
//     isError: isFoodError,
//   } = useGetFoodByIdQuery(id ?? "", {
//     skip: !id,
//   });

//   const food = responseData?.data || responseData;

//   // 🟢 Cart Dynamic Tax & Price Calculation
//   const quantity = food?.quantity || 1;
//   const unitPrice = food?.price || 0;
//   const subtotal = unitPrice * quantity;

//   // 💡 Cart Calculation Logic
//   const shipping = subtotal > 0 ? 15.99 : 0;
//   const tax = subtotal * 0.1; // 10% Tax Rate
//   const calculatedTotal = subtotal + shipping + tax;

//   // দশমিক মুক্ত বা ২ ঘর পর্যন্ত রাখার জন্য (e.g., 356.99)
//   const totalAmount = Number(calculatedTotal.toFixed(2));

//   // Form Submit Handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setValidationError("");

//     // Validation Check
//     if (!currentUserId) {
//       setValidationError("User not authenticated! Please log in first.");
//       return;
//     }
//     if (rating === 0) {
//       setValidationError("Please select a star rating!");
//       return;
//     }
//     if (!comment.trim()) {
//       setValidationError("Please write a short review comment!");
//       return;
//     }

//     // Schema অনুযায়ী সম্পূর্ণ Review Payload
//     const reviewData = {
//       foodId: id,
//       userId: currentUserId,
//       userName: singleUser?.name || user?.name || "Anonymous User",
//       userEmail: user?.email || singleUser?.email || "user@example.com",
//       foodName: food?.name,
//       unitPrice,
//       quantity,
//       subtotal,
//       tax: Number(tax.toFixed(2)),
//       shipping,
//       totalAmount, // 🟢 ট্যাক্স এবং শিপিংসহ মোট অ্যামাউন্ট সাবমিট হবে
//       rating,
//       comment: comment.trim(),
//     };

//     try {
//       // 🚀 ব্যাকএন্ডে ডেটা পাঠানো
//       const res = await createReview(reviewData).unwrap();

//       console.log("Submitted Review Payload:", reviewData);
//       console.log("Backend Response:", res);

//       setSubmitSuccess(true);
//     } catch (err: any) {
//       console.error("Failed to submit review:", err);
//       setValidationError(err?.data?.message || "Failed to submit review.");
//     }
//   };

//   if (isFoodLoading || isUserLoading) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
//         <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
//         <p className="text-sm font-medium">Loading details...</p>
//       </div>
//     );
//   }

//   if (isFoodError || !food) {
//     return (
//       <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur-md shadow-2xl">
//         <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
//           <AlertCircle className="w-6 h-6" />
//         </div>
//         <h3 className="text-lg font-bold text-slate-200">Item Not Found!</h3>
//         <p className="mt-2 text-xs text-slate-400">
//           No food item matched ID:{" "}
//           <span className="font-mono text-amber-400">{id}</span>
//         </p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 flex items-center gap-2 mx-auto cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4 sm:p-6 text-slate-100">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
//       >
//         <ArrowLeft className="w-4 h-4" /> Back to Orders
//       </button>

//       <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
//         {/* Product & Price Header */}
//         <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50">
//           {food.image ? (
//             <img
//               src={food.image}
//               alt={food.name}
//               className="w-16 h-16 object-cover rounded-2xl border border-slate-700 shadow-md shrink-0"
//             />
//           ) : (
//             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 text-slate-500 shrink-0">
//               <UtensilsCrossed className="w-8 h-8 text-amber-500/70" />
//             </div>
//           )}
//           <div className="flex-1">
//             <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
//               Rate Your Experience
//             </span>
//             <h2 className="text-xl font-bold text-slate-100">{food.name}</h2>

//             <div className="flex flex-wrap items-center gap-3 mt-1.5">
//               <div className="text-xs text-slate-400">
//                 Price:{" "}
//                 <span className="text-slate-200 font-semibold">
//                   ৳{unitPrice}
//                 </span>
//               </div>
//               <div className="text-xs text-slate-400 border-l border-slate-700 pl-3">
//                 Qty:{" "}
//                 <span className="text-slate-200 font-semibold">{quantity}</span>
//               </div>
//               {/* 🟢 ট্যাক্স ও শিপিংসহ সর্বমোট বিল */}
//               <div className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
//                 Total (Inc. Tax & Delivery): ৳{totalAmount}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🟢 সাবমিট সফল হলে Success Message দেখাবে */}
//         {submitSuccess ? (
//           <div className="my-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
//             <CheckCircle2 className="w-6 h-6 shrink-0" />
//             <div>
//               <h4 className="text-sm font-bold">Review Submitted!</h4>
//               <p className="text-xs text-emerald-400/80 mt-0.5">
//                 Thank you! Your review for {food.name} has been successfully
//                 submitted and logged.
//               </p>
//             </div>
//           </div>
//         ) : (
//           /* 📝 ফর্ম */
//           <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//             {/* User Email Field */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-300 mb-1.5">
//                 User Email (Auto-filled)
//               </label>
//               <div className="relative pointer-events-none select-none opacity-70">
//                 <input
//                   type="email"
//                   readOnly
//                   disabled
//                   value={user?.email || "user@example.com"}
//                   className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
//                 />
//                 <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
//               </div>
//             </div>

//             {/* User Name Field */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-300 mb-1.5">
//                 User Name (Auto-filled)
//               </label>
//               <div className="relative pointer-events-none select-none opacity-70">
//                 <input
//                   type="text"
//                   readOnly
//                   disabled
//                   value={singleUser?.name || user?.name || "Loading name..."}
//                   className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
//                 />
//                 <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
//               </div>
//             </div>

//             {/* Star Rating Section */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-300 mb-2">
//                 Your Rating <span className="text-rose-400">*</span>
//               </label>
//               <div className="flex items-center gap-2">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() => setRating(star)}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
//                   >
//                     <Star
//                       className={`w-8 h-8 transition-colors ${
//                         star <= (hoverRating || rating)
//                           ? "fill-amber-400 text-amber-400"
//                           : "text-slate-600 fill-slate-800"
//                       }`}
//                     />
//                   </button>
//                 ))}
//                 <span className="ml-2 text-sm font-bold text-amber-400">
//                   {hoverRating || rating ? `${hoverRating || rating} / 5` : ""}
//                 </span>
//               </div>
//             </div>

//             {/* Comment Box */}
//             <div>
//               <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
//                 <MessageSquare className="w-4 h-4 text-amber-400" />
//                 Your Feedback <span className="text-rose-400">*</span>
//               </label>
//               <textarea
//                 rows={4}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="How was the taste, packaging, and delivery? Share your experience..."
//                 className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
//               />
//             </div>

//             {/* Error Message */}
//             {validationError && (
//               <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 shrink-0" />
//                 {validationError}
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
//                 </>
//               ) : (
//                 "Submit Review"
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Review;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
  Mail,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetSingleReviewQuery,
  useGetFoodByIdQuery,
} from "../../Redux/features/items/itemsApi";
import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";

const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth?.user);
  const currentUserId = user?._id || user?.id;

  const { data: existingReviewResponse, isLoading: isReviewLoading } =
    useGetSingleReviewQuery(
      { orderId, foodId: id, userId: currentUserId },
      { skip: !orderId || !id || !currentUserId },
    );

  const existingReview = existingReviewResponse?.data;

  const [createReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const { data: userDataResponse } = useGetSingleUserQuery(currentUserId, {
    skip: !currentUserId,
  });
  const singleUser = userDataResponse?.data || userDataResponse;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const { data: responseData, isLoading: isFoodLoading } = useGetFoodByIdQuery(
    id ?? "",
    { skip: !id },
  );
  const food = responseData?.data || responseData;

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!orderId) {
      setValidationError(
        "Order ID is missing! Please open review from Order History.",
      );
      return;
    }
    if (rating === 0) {
      setValidationError("Please select a star rating!");
      return;
    }
    if (!comment.trim()) {
      setValidationError("Please write a short review comment!");
      return;
    }

    const reviewData = {
      orderId,
      foodId: id,
      userId: currentUserId,
      userName: singleUser?.name || user?.name || "Anonymous User",
      rating,
      comment: comment.trim(),
    };

    try {
      if (existingReview) {
        await updateReview(reviewData).unwrap();
      } else {
        await createReview(reviewData).unwrap();
      }
      setSubmitSuccess(true);
    } catch (err: any) {
      setValidationError(err?.data?.message || "Failed to save review.");
    }
  };

  if (isFoodLoading || isReviewLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-slate-100">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 cursor-pointer transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50">
          {food?.image ? (
            <img
              src={food.image}
              alt={food.name}
              className="w-16 h-16 object-cover rounded-2xl border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shrink-0">
              <UtensilsCrossed className="w-8 h-8 text-amber-500/70" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {existingReview ? "Update Feedback" : "Rate Your Experience"}
            </span>
            <h2 className="text-xl font-bold text-slate-100">{food?.name}</h2>
          </div>
        </div>

        {submitSuccess ? (
          <div className="my-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Review Saved!</h4>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                {existingReview
                  ? "Your review has been updated successfully."
                  : "Thank you for submitting your feedback!"}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                User Email
              </label>
              <div className="relative pointer-events-none opacity-70">
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || "user@example.com"}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                User Name
              </label>
              <div className="relative pointer-events-none opacity-70">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={singleUser?.name || user?.name || "Anonymous User"}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Rating <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-slate-600 fill-slate-800"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Your
                Feedback <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with taste, packaging, and delivery..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {validationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isUpdating}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Review;
