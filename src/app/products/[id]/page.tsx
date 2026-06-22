"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/lib/types";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { isAuthenticated, getAuthUser } from "@/lib/auth";
import { useCartStore } from "@/lib/cartStore";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const setItemCount = useCartStore((s) => s.setItemCount);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/products/public/${id}`)
      .then((res) => setProduct(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = getAuthUser();
    if (user?.role !== "BUYER") {
      setMessage("Only buyer accounts can add items to cart");
      return;
    }

    setAdding(true);
    try {
      const res = await api.post("/cart/add", {
        productId: product?.id,
        quantity,
      });
      setItemCount(res.data.data.totalItems);
      setMessage("Added to cart!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">Product not found.</div>
    );
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    activeImage === idx
                      ? "border-indigo-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-indigo-600 font-medium mb-1">
            {product.vendorShopName}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">
              {product.totalSold} sold
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ₹{displayPrice.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                ₹{product.price.toFixed(0)}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {product.stock > 0 ? (
            <p className="text-sm text-green-600 font-medium mb-4">
              In stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-sm text-red-600 font-medium mb-4">
              Out of stock
            </p>
          )}

          {message && (
            <div className="bg-indigo-50 text-indigo-700 text-sm rounded-lg p-3 mb-4">
              {message}
            </div>
          )}

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="p-3 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}