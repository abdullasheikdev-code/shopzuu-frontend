"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import {
  Star,
  ExternalLink,
  Heart,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice < product.price;

  const isAffiliate = product.productType === "AFFILIATE";

  const currentPrice = hasDiscount
    ? product.discountPrice!
    : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  const CardInner = (
    <>
      {/* IMAGE AREA */}
      <div className="relative aspect-[4/4.5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium">Image coming soon</span>
          </div>
        )}

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* TOP LEFT BADGES */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {hasDiscount && (
            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white shadow-lg">
              {discountPercent}% OFF
            </span>
          )}

          {isAffiliate && (
            <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-md">
              via {product.affiliateSource}
            </span>
          )}
        </div>

        {/* HEART BUTTON */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:text-rose-500"
        >
          <Heart className="h-[18px] w-[18px]" />
        </button>

        {/* HOVER ACTION */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-slate-900 shadow-xl backdrop-blur-md">
            {isAffiliate ? "View product" : "View details"}

            {isAffiliate ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
            {product.vendorShopName || "Shopzuu Seller"}
          </p>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-700">
              {product.rating?.toFixed(1) ?? "0.0"}
            </span>
          </div>
        </div>

        <h3 className="min-h-[48px] line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-700">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-slate-950">
                ₹{currentPrice.toFixed(0)}
              </span>

              {hasDiscount && (
                <span className="text-sm font-medium text-slate-400 line-through">
                  ₹{product.price.toFixed(0)}
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              {product.totalSold ?? 0} sold
            </p>
          </div>

          {!isAffiliate && product.stock === 0 ? (
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-600">
              SOLD OUT
            </span>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-all duration-300 group-hover:rotate-[-8deg] group-hover:bg-blue-600">
              {isAffiliate ? (
                <ExternalLink className="h-4 w-4" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses =
    "group block overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]";

  if (isAffiliate) {
    return (
      <a
        href={product.affiliateUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className={cardClasses}
      >
        {CardInner}
      </a>
    );
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={cardClasses}
    >
      {CardInner}
    </Link>
  );
}