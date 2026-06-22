"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShirtIcon, Smartphone, Home, Sparkles, Hammer, UtensilsCrossed, BookOpen, Dumbbell, LayoutGrid } from "lucide-react";
import api from "@/lib/api";
import { Category } from "@/lib/types";

const ICONS: Record<string, React.ReactNode> = {
  "Fashion & Clothing": <ShirtIcon className="w-5 h-5" />,
  "Electronics": <Smartphone className="w-5 h-5" />,
  "Home & Kitchen": <Home className="w-5 h-5" />,
  "Beauty & Personal Care": <Sparkles className="w-5 h-5" />,
  "Handmade & Crafts": <Hammer className="w-5 h-5" />,
  "Food & Beverages": <UtensilsCrossed className="w-5 h-5" />,
  "Books & Stationery": <BookOpen className="w-5 h-5" />,
  "Sports & Fitness": <Dumbbell className="w-5 h-5" />,
};

export default function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
      api.get("/categories").then((res) => setCategories(res.data.data));
    }
  }, [open]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-[300px] max-w-[85vw] h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-left">
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Browse Categories</span>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 py-2">
          <Link
            href="/products"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-50 font-medium"
          >
            <LayoutGrid className="w-5 h-5" />
            All Products
          </Link>

          <div className="h-px bg-gray-100 my-1" />

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50"
            >
              {ICONS[cat.name] ?? <LayoutGrid className="w-5 h-5 text-gray-400" />}
              {cat.name}
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-1" />

          <Link
            href="/become-vendor"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-indigo-600 font-medium hover:bg-indigo-50"
          >
            Sell on Shopzuu
          </Link>
        </div>
      </div>
    </div>
  );
}