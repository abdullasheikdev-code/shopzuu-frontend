"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Truck, BadgePercent } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/featured"),
      api.get("/categories"),
    ])
      .then(([featuredRes, catRes]) => {
        setFeatured(featuredRes.data.data);
        setCategories(catRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Shop from real sellers,
            <br />
            not big warehouses
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Shopzuu connects you directly with small businesses across India —
            fair prices, real stories, fast support.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              href="/become-vendor"
              className="border border-white/40 font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Sell on Shopzuu
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-white/10 bg-black/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-indigo-100">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Verified sellers
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" /> Fast dispatch
            </span>
            <span className="flex items-center gap-2">
              <BadgePercent className="w-4 h-4" /> Low fees, fair prices
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 hover:shadow-md transition-all"
            >
              <p className="font-medium text-gray-900">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-indigo-600 font-medium flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center text-gray-500">
            No featured products yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Vendor CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Have products to sell?
          </h2>
          <p className="text-gray-300 mb-6">
            Open your store on Shopzuu in minutes. ₹0 setup on the Free plan.
          </p>
          <Link
            href="/become-vendor"
            className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 inline-block transition-colors"
          >
            Become a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}