"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  MessageSquareText,
  PenLine,
  Send,
  Star,
  UserRound,
  X,
} from "lucide-react";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({
  productId,
}: {
  productId: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);

      setReviews(
        Array.isArray(res.data?.data?.reviews)
          ? res.data.data.reviews
          : []
      );

      setAvgRating(
        Number(res.data?.data?.averageRating || 0)
      );

      setTotalReviews(
        Number(res.data?.data?.totalReviews || 0)
      );
    } catch (err) {
      console.error("REVIEWS ERROR:", err);

      setReviews([]);
      setAvgRating(0);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError("Please log in to leave a review.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post(`/reviews/product/${productId}`, {
        rating,
        comment,
      });

      setShowForm(false);
      setComment("");
      setRating(5);

      setSuccess("Your review was submitted successfully.");

      await fetchReviews();

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
    setComment("");
    setRating(5);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />

        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-gray-100 p-5"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* REVIEW SUMMARY */}
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-[#fafafa] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-5">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-gray-950">
                {avgRating.toFixed(1)}
              </span>

              <span className="mb-1 text-sm font-semibold text-gray-400">
                / 5
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <Star
                  key={item}
                  className={`h-4 w-4 ${
                    item <= Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-16 w-px bg-gray-200" />

          <div>
            <p className="font-black text-gray-950">
              Customer rating
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              closeForm();
            } else {
              setShowForm(true);
              setError("");
              setSuccess("");
            }
          }}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition ${
            showForm
              ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              : "bg-gray-950 text-white shadow-sm hover:bg-indigo-600"
          }`}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" />
              Write a review
            </>
          )}
        </button>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="font-medium">
            {success}
          </p>
        </div>
      )}

      {/* REVIEW FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 sm:p-6"
        >
          <div className="mb-5">
            <h3 className="font-black text-gray-950">
              Share your experience
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Tell other customers what you think about this product.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                {error}
              </p>
            </div>
          )}

          {/* RATING */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Your rating
            </label>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRating(item)}
                  className="rounded-lg p-1 transition hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${item} stars`}
                >
                  <Star
                    className={`h-7 w-7 transition ${
                      item <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-white text-gray-300"
                    }`}
                  />
                </button>
              ))}

              <span className="ml-3 text-sm font-bold text-gray-600">
                {rating}.0
              </span>
            </div>
          </div>

          {/* COMMENT */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Your review
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this product..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <p className="mt-2 text-xs text-gray-400">
              Keep your review useful and relevant to the product.
            </p>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />

              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* REVIEWS */}
      <div className="mt-7">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
              <MessageSquareText className="h-5 w-5" />
            </div>

            <h3 className="mt-4 font-black text-gray-900">
              No reviews yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Be the first customer to share an experience with this
              product.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-gray-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* AVATAR */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-black text-gray-950">
                          {review.userName}
                        </p>

                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((item) => (
                            <Star
                              key={item}
                              className={`h-3.5 w-3.5 ${
                                item <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <time className="text-xs font-medium text-gray-400">
                        {review.createdAt
                          ? new Date(
                              review.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </time>
                    </div>

                    {review.comment && (
                      <p className="mt-4 text-sm leading-7 text-gray-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}