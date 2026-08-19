/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import {
  useGetFoodByIdQuery,
 // আপনার RTK Query Mutation টি ইম্পোর্ট করুন
} from "../../Redux/features/items/itemsApi";

const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form State & Validation
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // RTK Query hooks
  const {
    data: responseData,
    isLoading: isFoodLoading,
    isError: isFoodError,
  } = useGetFoodByIdQuery(id ?? "", {
    skip: !id,
  });

  // const [createReview, { isLoading: isSubmitting, error: submitError }] =
  //   useCreateReviewMutation();

  // RTK Query data wrapper handling
  const food = responseData?.data || responseData;

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (rating === 0) {
      setValidationError("Please select a star rating!");
      return;
    }
    if (!comment.trim()) {
      setValidationError("Please write a short review comment!");
      return;
    }
    if (comment.trim().length < 5) {
      setValidationError("Review comment must be at least 5 characters long!");
      return;
    }

    try {
      // await createReview({
      //   foodId: id,
      //   rating,
      //   comment: comment.trim(),
      // }).unwrap();

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(-1); // সফল সাবমিটের ২ সেকেন্ড পর আগের পেজে রিডাইরেক্ট
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  // Loading State UI
  if (isFoodLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm font-medium">Loading item details...</p>
      </div>
    );
  }

  // Error / 404 State UI
  if (isFoodError || !food) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur-md shadow-2xl">
        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">Item Not Found!</h3>
        <p className="mt-2 text-xs text-slate-400">
          No food item matched ID:{" "}
          <span className="font-mono text-amber-400">{id}</span>
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Main Review Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
        {/* Header - Food Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50">
          {food.image ? (
            <img
              src={food.image}
              alt={food.name}
              className="w-16 h-16 object-cover rounded-2xl border border-slate-700 shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 text-slate-500 shrink-0">
              <UtensilsCrossed className="w-8 h-8 text-amber-500/70" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Rate Your Experience
            </span>
            <h2 className="text-xl font-bold text-slate-100">{food.name}</h2>
            {food.category && (
              <p className="text-xs text-slate-400 mt-0.5">{food.category}</p>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess ? (
          <div className="my-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Review Submitted!</h4>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                Thank you for your feedback. Redirecting back...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Star Rating Section */}
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
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 fill-slate-800"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-amber-400">
                  {hoverRating || rating ? `${hoverRating || rating} / 5` : ""}
                </span>
              </div>
            </div>

            {/* Review Comment Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Your Feedback <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the taste, packaging, and delivery? Share your experience..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              ></textarea>
            </div>

            {/* Client Validation Error */}
            {validationError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {validationError}
              </div>
            )}

            {/* Backend API Error */}
            {/* {submitError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {(submitError as any)?.data?.message ||
                  "Failed to submit review. Please try again!"}
              </div>
            )} */}

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {/* {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting
                  Review...
                </>
              ) : (
                "Submit Review"
              )} */}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Review;
