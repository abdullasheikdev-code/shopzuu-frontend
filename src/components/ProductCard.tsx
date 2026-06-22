"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { Star, ExternalLink } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const isAffiliate = product.productType === "AFFILIATE";

  const CardInner = (
    <>
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {isAffiliate && (
          <span className="absolute top-2 left-2 bg-white/90 text-xs font-medium text-gray-700 px-2 py-1 rounded-full shadow-sm">
            via {product.affiliateSource}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-indigo-600 font-medium mb-1">
          {product.vendorShopName}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">
            {product.rating.toFixed(1)} · {product.totalSold} sold
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{(hasDiscount ? product.discountPrice : product.price)?.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toFixed(0)}
            </span>
          )}
        </div>

        {isAffiliate ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-indigo-600">
            View on {product.affiliateSource}
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        ) : (
          product.stock === 0 && (
            <span className="text-xs text-red-600 font-medium">
              Out of stock
            </span>
          )
        )}
      </div>
    </>
  );

  // Affiliate products open the external link directly in a new tab.
  // Vendor products go to your internal product detail page as before.
  if (isAffiliate) {
    return (
      <a
        href={product.affiliateUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow block"
      >
        {CardInner}
      </a>
    );
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow block"
    >
      {CardInner}
    </Link>
  );
}