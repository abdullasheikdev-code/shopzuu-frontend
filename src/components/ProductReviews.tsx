"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = () => {
    api.get(`/reviews/product/${productId}`).then((res) => {
      setReviews(res.data.data.reviews);
      setAvgRating(res.data.data.averageRating);
      setTotalReviews(res.data.data.totalReviews);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setError("Please log in to leave a review");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/reviews/product/${productId}`, { rating, comment });
      setShowForm(false);
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Customer Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {avgRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-3">
              {error}
            </div>
          )}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                className="p-0.5"
              >
                <Star
                  className={`w-6 h-6 ${
                    i <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {r.userName}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i <= r.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-gray-600">{r.comment}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {r.createdAt.slice(0, 10)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}