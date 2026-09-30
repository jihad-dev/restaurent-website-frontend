// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
//   Sparkles,
//   ShieldCheck,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import {
//   useAddReviewMutation,
//   useUpdateReviewMutation,
//   useGetSingleReviewQuery,
//   useGetFoodByIdQuery,
// } from "../../Redux/features/items/itemsApi";
// import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";

// const Review: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   const navigate = useNavigate();

//   const user = useSelector((state: any) => state.auth?.user);
//   const currentUserId = user?._id || user?.id;

//   const { data: existingReviewResponse, isLoading: isReviewLoading } =
//     useGetSingleReviewQuery(
//       { orderId, foodId: id, userId: currentUserId },
//       { skip: !orderId || !id || !currentUserId },
//     );

//   const existingReview = existingReviewResponse?.data;

//   const [createReview, { isLoading: isSubmitting }] = useAddReviewMutation();
//   const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

//   const { data: userDataResponse } = useGetSingleUserQuery(currentUserId, {
//     skip: !currentUserId,
//   });
//   const singleUser = userDataResponse?.data || userDataResponse;

//   const [rating, setRating] = useState<number>(0);
//   const [hoverRating, setHoverRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>("");
//   const [validationError, setValidationError] = useState<string>("");
//   const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

//   const { data: responseData, isLoading: isFoodLoading } = useGetFoodByIdQuery(
//     id ?? "",
//     { skip: !id },
//   );
//   const food = responseData?.data || responseData;

//   useEffect(() => {
//     if (existingReview) {
//       setRating(existingReview.rating || 0);
//       setComment(existingReview.comment || "");
//     }
//   }, [existingReview]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setValidationError("");

//     if (!orderId) {
//       setValidationError(
//         "Order ID is missing! Please open review from Order History.",
//       );
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

//     const reviewData = {
//       orderId,
//       foodId: id,
//       userId: currentUserId,
//       userName: singleUser?.name || user?.name || "Anonymous User",
//       rating,
//       comment: comment.trim(),
//     };

//     try {
//       if (existingReview) {
//         await updateReview(reviewData).unwrap();
//       } else {
//         await createReview(reviewData).unwrap();
//       }
//       setSubmitSuccess(true);
//     } catch (err: any) {
//       setValidationError(err?.data?.message || "Failed to save review.");
//     }
//   };

//   if (isFoodLoading || isReviewLoading) {
//     return (
//       <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 text-slate-400">
//         <div className="relative flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
//           <UtensilsCrossed className="w-6 h-6 text-amber-500 absolute" />
//         </div>
//         <p className="text-sm font-semibold tracking-wide text-slate-300 animate-pulse">
//           Loading item details...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
//       {/* Background Decorative Ambient Glows */}
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

//       <div className="w-full max-w-xl mx-auto space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300 shadow-sm cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           Back to Orders
//         </button>

//         {/* Main Card */}
//         <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60 relative overflow-hidden">
//           {/* Subtle top border highlights */}
//           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

//           {/* Product Header */}
//           <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-slate-800/80">
//             {food?.image ? (
//               <div className="relative group">
//                 <img
//                   src={food.image}
//                   alt={food.name}
//                   className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-slate-700/80 shadow-md group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
//               </div>
//             ) : (
//               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 shadow-md shrink-0">
//                 <UtensilsCrossed className="w-8 h-8 text-amber-500/80" />
//               </div>
//             )}
//             <div className="space-y-1">
//               <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
//                 <Sparkles className="w-3 h-3" />
//                 {existingReview ? "Update Feedback" : "Rate Your Experience"}
//               </span>
//               <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight leading-snug">
//                 {food?.name}
//               </h2>
//             </div>
//           </div>

//           {/* Success State */}
//           {submitSuccess ? (
//             <div className="my-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 text-center animate-in zoom-in-95 duration-300">
//               <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
//                 <CheckCircle2 className="w-7 h-7" />
//               </div>
//               <div>
//                 <h4 className="text-base font-bold text-slate-100">
//                   Review Saved Successfully!
//                 </h4>
//                 <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
//                   {existingReview
//                     ? "Your feedback has been updated and published."
//                     : "Thank you! Your feedback helps us improve our service."}
//                 </p>
//               </div>
//               <button
//                 onClick={() => navigate(-1)}
//                 className="mt-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
//               >
//                 Return to Orders
//               </button>
//             </div>
//           ) : (
//             /* Review Form */
//             <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//               {/* Readonly User Info Fields Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-400 mb-1.5">
//                     User Email
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       readOnly
//                       disabled
//                       value={user?.email || "user@example.com"}
//                       className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-400 cursor-not-allowed focus:outline-none"
//                     />
//                     <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-slate-400 mb-1.5">
//                     User Name
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       readOnly
//                       disabled
//                       value={singleUser?.name || user?.name || "Anonymous User"}
//                       className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-400 cursor-not-allowed focus:outline-none"
//                     />
//                     <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
//                   </div>
//                 </div>
//               </div>

//               {/* Interactive Star Rating */}
//               <div className="bg-slate-950/40 border border-slate-800/60 p-4 sm:p-5 rounded-2xl text-center space-y-2">
//                 <label className="block text-xs font-semibold text-slate-300">
//                   Your Rating <span className="text-rose-400">*</span>
//                 </label>
//                 <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
//                   {[1, 2, 3, 4, 5].map((star) => {
//                     const active = star <= (hoverRating || rating);
//                     return (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setRating(star)}
//                         onMouseEnter={() => setHoverRating(star)}
//                         onMouseLeave={() => setHoverRating(0)}
//                         className="p-1 cursor-pointer transition-all duration-200 transform hover:scale-125 focus:outline-none"
//                       >
//                         <Star
//                           className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
//                             active
//                               ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
//                               : "text-slate-700 fill-slate-900/50"
//                           }`}
//                         />
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <p className="text-[11px] font-medium text-slate-400 h-4">
//                   {hoverRating === 1 || rating === 1
//                     ? "Poor 😞"
//                     : hoverRating === 2 || rating === 2
//                       ? "Fair 😐"
//                       : hoverRating === 3 || rating === 3
//                         ? "Good 🙂"
//                         : hoverRating === 4 || rating === 4
//                           ? "Very Good 😃"
//                           : hoverRating === 5 || rating === 5
//                             ? "Excellent! 🤩"
//                             : "Select rating stars"}
//                 </p>
//               </div>

//               {/* Feedback Textarea */}
//               <div>
//                 <label className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300">
//                   <span className="flex items-center gap-1.5">
//                     <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
//                     Your Feedback <span className="text-rose-400">*</span>
//                   </span>
//                   <span className="text-[10px] text-slate-500 font-normal">
//                     {comment.length} characters
//                   </span>
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   placeholder="Share your experience with taste, packaging, and delivery..."
//                   className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 resize-none transition-all shadow-inner"
//                 />
//               </div>

//               {/* Validation Error Banner */}
//               {validationError && (
//                 <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
//                   <AlertCircle className="w-4 h-4 shrink-0" />
//                   <span className="font-medium">{validationError}</span>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting || isUpdating}
//                 className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
//               >
//                 {isSubmitting || isUpdating ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Saving Review...</span>
//                   </>
//                 ) : existingReview ? (
//                   <>
//                     <ShieldCheck className="w-4 h-4" />
//                     <span>Update Review</span>
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-4 h-4" />
//                     <span>Submit Review</span>
//                   </>
//                 )}
//               </button>
//             </form>
//           )}
//         </div>
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
  Sparkles,
  ShieldCheck,
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

  const existingReview = (existingReviewResponse as any)?.data;

  const [createReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const { data: userDataResponse } = useGetSingleUserQuery(currentUserId, {
    skip: !currentUserId,
  });
  const singleUser = (userDataResponse as any)?.data || userDataResponse;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const { data: responseData, isLoading: isFoodLoading } = useGetFoodByIdQuery(
    id ?? "",
    { skip: !id },
  );
  const food = (responseData as any)?.data || responseData;

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
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <UtensilsCrossed className="w-6 h-6 text-amber-500 absolute" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300 animate-pulse">
          Loading item details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl mx-auto space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Orders
        </button>

        {/* Main Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Subtle top border highlights */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* Product Header */}
          <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-slate-800/80">
            {food?.image ? (
              <div className="relative group">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-slate-700/80 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 shadow-md shrink-0">
                <UtensilsCrossed className="w-8 h-8 text-amber-500/80" />
              </div>
            )}
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                {existingReview ? "Update Feedback" : "Rate Your Experience"}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight leading-snug">
                {food?.name}
              </h2>
            </div>
          </div>

          {/* Success State */}
          {submitSuccess ? (
            <div className="my-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 text-center animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">
                  Review Saved Successfully!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {existingReview
                    ? "Your feedback has been updated and published."
                    : "Thank you! Your feedback helps us improve our service."}
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="mt-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Return to Orders
              </button>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Readonly User Info Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    User Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={user?.email || "user@example.com"}
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    User Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={singleUser?.name || user?.name || "Anonymous User"}
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Interactive Star Rating */}
              <div className="bg-slate-950/40 border border-slate-800/60 p-4 sm:p-5 rounded-2xl text-center space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Rating <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-all duration-200 transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                            active
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "text-slate-700 fill-slate-900/50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium text-slate-400 h-4">
                  {hoverRating === 1 || rating === 1
                    ? "Poor 😞"
                    : hoverRating === 2 || rating === 2
                      ? "Fair 😐"
                      : hoverRating === 3 || rating === 3
                        ? "Good 🙂"
                        : hoverRating === 4 || rating === 4
                          ? "Very Good 😃"
                          : hoverRating === 5 || rating === 5
                            ? "Excellent! 🤩"
                            : "Select rating stars"}
                </p>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Your Feedback <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {comment.length} characters
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with taste, packaging, and delivery..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 resize-none transition-all shadow-inner"
                />
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{validationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Review...</span>
                  </>
                ) : existingReview ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Review</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
