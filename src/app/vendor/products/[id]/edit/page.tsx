"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import ProductReviews from "@/components/ProductReviews";
import {
  ArrowLeft,
  MessageSquareText,
  Pencil,
} from "lucide-react";

export default function EditProductPage() {
  const params = useParams();

  const productId = Number(params.id);

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      {/* PAGE HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/vendor/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Pencil className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Edit Product
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update your product information, pricing, inventory,
                images, and listing settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT FORM */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductForm productId={productId} />

        {/* PRODUCT REVIEWS */}
        <section className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <MessageSquareText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-gray-950">
                Product Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                See ratings and feedback submitted by buyers.
              </p>
            </div>
          </div>

          <div className="p-6">
            <ProductReviews productId={productId} />
          </div>
        </section>
      </div>
    </main>
  );
}