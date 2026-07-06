import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc]">
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
              <PackagePlus className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Add New Product
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new listing for your Shopzuu store.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductForm />
      </div>
    </main>
  );
}