"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/lib/types";
import { getAuthUser } from "@/lib/auth";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export default function VendorProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.role !== "VENDOR") {
      router.push("/login");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/vendor/products")
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/vendor/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/vendor/products/${id}/toggle-featured`);
      const updated = res.data.data;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: updated.isFeatured } : p))
      );
    } catch (err) {
      alert("Failed to toggle featured status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link
          href="/vendor/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 mb-4">
            You haven&apos;t added any products yet.
          </p>
          <Link
            href="/vendor/products/new"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 inline-block"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Sold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">₹{p.price.toFixed(0)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.totalSold}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={togglingId === p.id}
                      onClick={() => handleToggleFeatured(p.id)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-colors disabled:opacity-50 ${
                        p.featured
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          p.featured ? "fill-yellow-500 text-yellow-500" : ""
                        }`}
                      />
                      {togglingId === p.id
                        ? "..."
                        : p.featured
                        ? "Featured"
                        : "Not Featured"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/vendor/products/${p.id}/edit`}
                        className="p-2 text-gray-500 hover:text-indigo-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}