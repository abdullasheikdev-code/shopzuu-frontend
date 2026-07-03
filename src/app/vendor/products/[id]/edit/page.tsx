"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import ProductRow from "@/components/ProductReviews";
import ProductReviews from "@/components/ProductReviews";

export default function EditProductPage() {
  const { id } = useParams();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm productId={Number(id)} />
      <ProductReviews productId={Number(id)} />
      <ProductRow productId={Number(id)} />
    </div>
  );
}