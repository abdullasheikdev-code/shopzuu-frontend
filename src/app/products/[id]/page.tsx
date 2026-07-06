"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/lib/types";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ImageIcon,
} from "lucide-react";
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
      .catch((err) => {
        console.error("Product Error:", err);
        setProduct(null);
      })
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
      setMessage(
        err.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-[#f8fafc] px-4 py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
            <Package className="h-9 w-9 text-slate-400" />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-950">
            Product not found
          </h1>

          <p className="mt-2 text-slate-500">
            This product may have been removed or is no longer available.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="mt-7 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Explore products
          </button>
        </div>
      </main>
    );
  }

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount
    ? product.discountPrice!
    : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) /
          product.price) *
          100
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* BREADCRUMB */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-hidden px-4 py-4 text-sm sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="shrink-0 text-slate-500 transition hover:text-blue-600"
          >
            Home
          </button>

          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />

          <button
            onClick={() => router.push("/products")}
            className="shrink-0 text-slate-500 transition hover:text-blue-600"
          >
            Products
          </button>

          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />

          <span className="truncate font-semibold text-slate-900">
            {product.name}
          </span>
        </div>
      </div>

      {/* PRODUCT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* IMAGE GALLERY */}

          <div>
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white">
              <div className="aspect-square bg-[#f1f5f9]">
                {product.images?.[activeImage] ? (
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 sm:p-8"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="h-12 w-12" />
                    <span className="mt-3 text-sm font-semibold">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {hasDiscount && (
                <div className="absolute left-5 top-5 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-black text-white shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* THUMBNAILS */}

            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${
                      activeImage === idx
                        ? "border-blue-600 shadow-md shadow-blue-600/10"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS */}

          <div className="flex flex-col justify-center">

            {/* SHOP */}

            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              {product.vendorShopName || "Shopzuu Seller"}
            </p>

            {/* NAME */}

            <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                <span className="text-sm font-black text-slate-900">
                  {(product.rating || 0).toFixed(1)}
                </span>
              </div>

              <span className="text-slate-300">•</span>

              <span className="text-sm font-medium text-slate-500">
                {product.totalSold || 0} sold
              </span>

              <span className="text-slate-300">•</span>

              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  In stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Out of stock
                </span>
              )}
            </div>

            {/* PRICE */}

            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-slate-950">
                ₹{displayPrice.toFixed(0)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-xl font-semibold text-slate-400 line-through">
                    ₹{product.price.toFixed(0)}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    Save ₹
                    {(product.price - product.discountPrice!).toFixed(0)}
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-7 border-t border-slate-200 pt-7">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
                About this product
              </h2>

              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {product.description ||
                  "Product details will be available soon."}
              </p>
            </div>

            {/* STOCK INFO */}

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Check className="h-4 w-4 text-emerald-600" />

                <span>
                  <strong className="font-bold text-slate-900">
                    {product.stock}
                  </strong>{" "}
                  available
                </span>
              </div>
            )}

            {/* MESSAGE */}

            {message && (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
                  message === "Added to cart!"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* BUY SECTION */}

            {product.stock > 0 && (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                {/* QUANTITY */}

                <div className="flex h-14 items-center justify-between rounded-xl border border-slate-200 bg-white sm:w-40">
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    disabled={quantity <= 1}
                    className="flex h-full w-12 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-8 text-center font-black text-slate-950">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(product.stock, q + 1)
                      )
                    }
                    disabled={quantity >= product.stock}
                    className="flex h-full w-12 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* ADD CART */}

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingCart className="h-5 w-5" />

                  {adding ? "Adding to cart..." : "Add to cart"}
                </button>
              </div>
            )}

            {/* TRUST FEATURES */}

            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-slate-200 pt-7">
              <TrustItem
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Secure"
                subtitle="Protected"
              />

              <TrustItem
                icon={<Truck className="h-5 w-5" />}
                title="Delivery"
                subtitle="Tracked"
              />

              <TrustItem
                icon={<RotateCcw className="h-5 w-5" />}
                title="Support"
                subtitle="Reliable"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 text-center sm:flex-row sm:gap-3 sm:text-left">
      <div className="text-blue-600">{icon}</div>

      <div className="mt-2 sm:mt-0">
        <p className="text-xs font-black text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square animate-pulse rounded-[28px] bg-slate-200" />

          <div className="flex flex-col justify-center">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-5 h-12 w-4/5 animate-pulse rounded-xl bg-slate-200" />

            <div className="mt-3 h-12 w-2/3 animate-pulse rounded-xl bg-slate-200" />

            <div className="mt-7 h-8 w-28 animate-pulse rounded bg-slate-200" />

            <div className="mt-8 h-4 w-full animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />

            <div className="mt-8 h-14 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}